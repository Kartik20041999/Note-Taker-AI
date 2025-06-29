import React, { useState } from 'react';
import { Mic, MicOff, Settings, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useSettings } from '@/hooks/useSettings';
import { TranscriptionService } from '@/services/transcriptionService';
import { AIService } from '@/services/aiService';
import { NotesService } from '@/services/notesService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useSettings();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [summaryText, setSummaryText] = useState('');

  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    error: recordingError
  } = useVoiceRecording();

  const handleStartRecording = async () => {
    setTranscriptionText('');
    setSummaryText('');
    clearRecording();
    await startRecording();
    toast({ title: "Recording Started", description: "Speak your note now..." });
  };

  const handleStopRecording = () => {
    stopRecording();
    toast({ title: "Recording Stopped", description: "Processing your recording..." });
  };

  async function uploadAudio(audioBlob: Blob): Promise<string | null> {
    const fileName = `${Date.now()}.webm`;
    const { error } = await supabase.storage.from('recordings').upload(fileName, audioBlob, {
      contentType: 'audio/webm',
      upsert: true
    });

    if (error) {
      console.error('Audio upload failed:', error);
      return null;
    }

    const { data } = supabase.storage.from('recordings').getPublicUrl(fileName);
    return data?.publicUrl || null;
  }

  const handleTranscribeAndSave = async () => {
    if (!audioBlob) {
      toast({ title: "No Recording", description: "Please record audio first.", variant: "destructive" });
      return;
    }

    if (settings.transcriptionProvider !== 'huggingface' && !settings.apiKey.trim()) {
      toast({ title: "API Key Required", description: "Please set your API key in Settings.", variant: "destructive" });
      return;
    }

    setIsTranscribing(true);

    try {
      const transcriptionResult = await TranscriptionService.transcribeAudio(
        audioBlob,
        settings.transcriptionProvider,
        settings.apiKey
      );

      if (transcriptionResult.error) {
        toast({ title: "Transcription Failed", description: transcriptionResult.error, variant: "destructive" });
        return;
      }

      setTranscriptionText(transcriptionResult.text);

      let summary = '';
      if (settings.transcriptionProvider === 'openai' && settings.apiKey && transcriptionResult.text) {
        setIsGeneratingSummary(true);
        try {
          summary = await AIService.generateSummary(transcriptionResult.text, 'openai', settings.apiKey);
          setSummaryText(summary);
        } catch (error) {
          console.error('Summary generation failed:', error);
        }
        setIsGeneratingSummary(false);
      }

      const audioUrl = await uploadAudio(audioBlob);

      if (!audioUrl) {
        toast({ title: "Upload Failed", description: "Could not upload audio recording.", variant: "destructive" });
        return;
      }

      const { error: saveError } = await NotesService.saveNote(transcriptionResult.text, summary, audioUrl);

      if (saveError) {
        toast({ title: "Save Failed", description: "Failed to save note to database.", variant: "destructive" });
      } else {
        toast({ title: "Note Saved", description: "Your voice note has been saved successfully!" });
        clearRecording();
        setTranscriptionText('');
        setSummaryText('');
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsTranscribing(false);
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* UI same as your latest version */}
      {/* Keeping this short for brevity */}
    </div>
  );
};

export default Index;
