import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Calendar as CalendarIcon, Smile, Meh, Frown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { saveJournalEntry, getJournalEntries } from './services/data-service';
import { generateRecommendations } from './services/gemini-service';
import { analyzeSentiment } from './services/sentiment-service';
import JournalSentimentChart from './journal-sentiment-chart';

export default function JournalPage() {
  const [goodThing1, setGoodThing1] = useState('');
  const [goodThing2, setGoodThing2] = useState('');
  const [goodThing3, setGoodThing3] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState<number | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const journalEntries = getJournalEntries();
    setEntries(journalEntries);
  };

  const startVoiceInput = (fieldNumber: number) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentField(fieldNumber);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      if (fieldNumber === 1) setGoodThing1(transcript);
      else if (fieldNumber === 2) setGoodThing2(transcript);
      else if (fieldNumber === 3) setGoodThing3(transcript);
      
      toast.success('Voice captured successfully!');
    };

    recognition.onerror = () => {
      toast.error('Voice recognition failed. Please try again.');
      setIsListening(false);
      setCurrentField(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setCurrentField(null);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    if (!goodThing1 || !goodThing2 || !goodThing3) {
      toast.error('Please fill in all three good things');
      return;
    }

    setLoading(true);

    try {
      const sentiment = await analyzeSentiment([goodThing1, goodThing2, goodThing3].join(' '));
      
      const entry = {
        goodThings: [goodThing1, goodThing2, goodThing3],
        date: new Date().toISOString(),
        sentiment,
      };

      saveJournalEntry(entry);
      await generateRecommendations();

      toast.success('Journal entry saved! Check your home page for personalized recommendations.');

      setGoodThing1('');
      setGoodThing2('');
      setGoodThing3('');
      loadEntries();
    } catch (error) {
      toast.error('Failed to save journal entry');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.6) return <Smile className="w-5 h-5" />;
    if (sentiment > 0.4) return <Meh className="w-5 h-5" />;
    return <Frown className="w-5 h-5" />;
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.6) return 'Positive';
    if (sentiment > 0.4) return 'Neutral';
    return 'Negative';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="nb-heading-lg">DAILY JOURNAL</h1>
        <p className="nb-body mt-2">Write down 3 good things that happened today</p>
      </div>

      {/* Journal Entry Form */}
      <div className="nb-card">
        <div className="space-y-4">
          {/* Good Thing 1 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="nb-heading-xs" style={{ fontSize: '1rem' }}>1. FIRST GOOD THING</label>
              <button
                className={`nb-button nb-button-sm ${isListening && currentField === 1 ? 'nb-button-danger' : ''}`}
                onClick={() => startVoiceInput(1)}
                disabled={isListening && currentField !== 1}
              >
                {isListening && currentField === 1 ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Voice
                  </>
                )}
              </button>
            </div>
            <textarea
              value={goodThing1}
              onChange={(e) => setGoodThing1(e.target.value)}
              placeholder="Example: Had a great conversation with a friend"
              rows={3}
              className="nb-textarea"
              style={{ background: 'var(--nb-lavender)' }}
            />
          </div>

          {/* Good Thing 2 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="nb-heading-xs" style={{ fontSize: '1rem' }}>2. SECOND GOOD THING</label>
              <button
                className={`nb-button nb-button-sm ${isListening && currentField === 2 ? 'nb-button-danger' : ''}`}
                onClick={() => startVoiceInput(2)}
                disabled={isListening && currentField !== 2}
              >
                {isListening && currentField === 2 ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Voice
                  </>
                )}
              </button>
            </div>
            <textarea
              value={goodThing2}
              onChange={(e) => setGoodThing2(e.target.value)}
              placeholder="Example: Finished an important assignment"
              rows={3}
              className="nb-textarea"
              style={{ background: 'var(--nb-peach)' }}
            />
          </div>

          {/* Good Thing 3 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="nb-heading-xs" style={{ fontSize: '1rem' }}>3. THIRD GOOD THING</label>
              <button
                className={`nb-button nb-button-sm ${isListening && currentField === 3 ? 'nb-button-danger' : ''}`}
                onClick={() => startVoiceInput(3)}
                disabled={isListening && currentField !== 3}
              >
                {isListening && currentField === 3 ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Voice
                  </>
                )}
              </button>
            </div>
            <textarea
              value={goodThing3}
              onChange={(e) => setGoodThing3(e.target.value)}
              placeholder="Example: Enjoyed a peaceful walk"
              rows={3}
              className="nb-textarea"
              style={{ background: 'var(--nb-mint)' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !goodThing1 || !goodThing2 || !goodThing3}
            className="nb-button nb-button-primary nb-button-lg"
            style={{ width: '100%' }}
          >
            <Send className="w-5 h-5" />
            {loading ? 'Saving Entry...' : 'Save Journal Entry'}
          </button>
        </div>
      </div>

      {/* Sentiment Analysis */}
      {entries.length > 0 && (
        <div className="nb-card">
          <h2 className="nb-heading-sm mb-4">JOURNAL SENTIMENT ANALYSIS</h2>
          <JournalSentimentChart entries={entries} />
        </div>
      )}

      {/* Past Entries */}
      <div className="nb-card">
        <h2 className="nb-heading-sm mb-4">PAST ENTRIES</h2>
        {entries.length === 0 ? (
          <div className="text-center py-8 nb-card nb-card-yellow" style={{ margin: 0 }}>
            <p className="nb-body">No journal entries yet. Start writing to track your progress!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 5).reverse().map((entry, index) => (
              <div key={index} className="nb-card" style={{ 
                borderLeft: '6px solid var(--nb-black)',
                padding: '1.5rem'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="nb-body-sm" style={{ fontWeight: 700 }}>
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {entry.sentiment && (
                    <div className="nb-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getSentimentIcon(entry.sentiment)}
                      {getSentimentLabel(entry.sentiment)}
                    </div>
                  )}
                </div>
                <ul className="space-y-2">
                  {entry.goodThings.map((thing: string, i: number) => (
                    <li key={i} className="nb-body-sm flex gap-2">
                      <span style={{ fontWeight: 800 }}>•</span>
                      <span>{thing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
