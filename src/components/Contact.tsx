import { MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface GalleryProps {
  onAddToCart: (product: Product) => void;
}

export default function Gallery({ onAddToCart }: GalleryProps) {
  const products: Product[] = [
    {
      id: 'custom-1',
      name: 'Mango Whipped Cream Cake',
      price: 2500,
      description: 'Fresh mango topped whipped cream cake with mint garnish',
      category: 'Customised',
      image: '/whatsapp_image_2025-12-27_at_11.52.26_pm.jpeg',
    },
    {
      id: 'custom-2',
      name: 'Classic White Cake',
      price: 2200,
      description: 'Elegant white cake with beautiful piped frosting design',
      category: 'Customised',
      image: '/whatsapp_image_2025-12-27_at_11.52.25_pm_(2).jpeg',
    },
    {
      id: 'custom-3',
      name: 'Colored Frosting Cupcakes',
      price: 1800,
      description: 'Assorted cupcakes with vibrant colored frosting',
      category: 'Customised',
      image: '/whatsapp_image_2025-12-27_at_11.52.25_pm_(1).jpeg',
    },
    {
      id: 'custom-4',
      name: 'Character Cake',
      price: 3200,
      description: 'Fun and cute themed cake with detailed character design',
      category: 'Customised',
      image: '/whatsapp_image_2025-12-27_at_11.52.25_pm.jpeg',
    },
  ];

  return (
    <section id="customised" className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">Customised Cakes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create your perfect cake with our custom design service. From elegant celebrations to playful themes, we bring your cake dreams to life.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 bg-white rounded-lg p-4 max-w-lg mx-auto">
            <MessageCircle className="text-green-500" size={24} />
            <span className="text-gray-700">To order customised cakes </span>
            <a
              href="https://wa.me/923368862917?text=HI%20I%20would%20like%20to%20order%20customised%20cake"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              contact us on WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 className="text-white font-semibold text-lg">{product.name}</h3>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
