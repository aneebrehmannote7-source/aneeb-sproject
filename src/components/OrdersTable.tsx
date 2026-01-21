import { useState, useEffect } from 'react';
import { AlertCircle, Loader, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrderItem {
  product_name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_token: string;
  name: string;
  phone: string;
  email: string;
  special_instructions: string;
  payment_proof_url: string | null;
  payment_method: string;
  created_at: string;
  delivery_fee: number;
  total_amount: number;
  items: OrderItem[];
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_token, name, phone, email, special_instructions, payment_proof_url, payment_method, created_at, delivery_fee, total_amount')
        .order('created_at', { ascending: false });

      if (ordersError) {
        setError('Failed to fetch orders');
        return;
      }

      if (!ordersData) {
        setOrders([]);
        return;
      }

      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('product_name, price, quantity')
            .eq('order_id', order.id);

          return {
            ...order,
            items: itemsData || [],
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateSubtotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-amber-600 w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-lg">
        <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
            className="w-full px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex-1 text-left">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{order.name}</p>
                  <p className="text-sm text-gray-600">Order Token: {order.order_token}</p>
                  <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-700 text-lg">{order.total_amount} PKR</p>
                  <p className="text-sm text-gray-600 capitalize">{order.payment_method}</p>
                </div>
              </div>
            </div>
            {expandedOrderId === order.id ? (
              <ChevronUp className="text-gray-400" />
            ) : (
              <ChevronDown className="text-gray-400" />
            )}
          </button>

          {expandedOrderId === order.id && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{order.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{order.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">{order.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Order Token</p>
                      <p className="font-mono text-gray-900 break-all">{order.order_token}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Placed On</p>
                      <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {order.special_instructions && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                    {order.special_instructions}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="bg-white border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">Product</th>
                        <th className="px-4 py-2 text-right text-gray-700 font-medium">Price</th>
                        <th className="px-4 py-2 text-right text-gray-700 font-medium">Qty</th>
                        <th className="px-4 py-2 text-right text-gray-700 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                          <td className="px-4 py-3 text-gray-900">{item.product_name}</td>
                          <td className="px-4 py-3 text-right text-gray-900">{item.price} PKR</td>
                          <td className="px-4 py-3 text-right text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            {item.price * item.quantity} PKR
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 bg-white border border-gray-200 rounded p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">{calculateSubtotal(order.items)} PKR</span>
                  </div>
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium text-gray-900">{order.delivery_fee} PKR</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-amber-700">{order.total_amount} PKR</span>
                  </div>
                </div>
              </div>

              {order.payment_proof_url && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Proof</h3>
                  <a
                    href={order.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    View Payment Proof
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
