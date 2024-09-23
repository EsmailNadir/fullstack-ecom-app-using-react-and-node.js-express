import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
    return (
        <div className="flex flex-col w-64 border border-gray-300 rounded-lg overflow-hidden m-2 shadow-md">
            <div className="h-52 flex justify-center items-center p-4">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                />
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h2 className="text-lg font-bold mb-1 truncate">{product.name}</h2>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                    </p>
                    <p className="text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
                    <p className="text-sm mb-4 text-yellow-500"> Rating: {product.ratings}</p>
                </div>
                <Link
                    to={`/productAbout/${product._id}`}
                    className="text-blue-500 hover:underline mb-4"
                >
                    View Details
                </Link>
                <button
                    onClick={() => onAddToCart(product._id)}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
