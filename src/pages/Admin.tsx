import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import OrdersTable from '../components/OrdersTable';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'settings' | 'orders'>('orders');
  const [resendApiKey, setResendApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'resend_api_key')
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        setFetching(false);
        return;
      }

      if (data) {
        setResendApiKey(data.value);
      }
      setFetching(false);
    } catch (err) {
      console.error('Error:', err);
      setFetching(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error: existsError, data: existingData } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'resend_api_key')
        .maybeSingle();

      if (existingData) {
        const { error } = await supabase
          .from('settings')
          .update({
            value: resendApiKey,
            updated_at: new Date().toISOString(),
          })
          .eq('key', 'resend_api_key');

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([
            {
              key: 'resend_api_key',
              value: resendApiKey,
              description: 'API key for Resend email service',
            },
          ]);

        if (error) throw error;
      }

      setMessage({
        type: 'success',
        text: 'Resend API key saved successfully!',
      });
    } catch (err) {
      console.error('Error:', err);
      setMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'orders' && <OrdersTable />}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600 mb-8">Configure your application settings</p>

                <form onSubmit={handleSave} className="space-y-6">
            {message && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                )}
                <p
                  className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}
                >
                  {message.text}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resend API Key
              </label>
              <p className="text-gray-600 text-sm mb-4">
                Enter your Resend API key to enable email notifications for orders. Get your key from{' '}
                <a
                  href="https://resend.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  resend.com
                </a>
              </p>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your API key is securely stored in the database and never
                exposed to the frontend. It's used only by the backend to send order confirmation
                emails.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !resendApiKey}
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
