/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ArrowRight } from "lucide-react";
import { Images } from "../../constants/image-strings";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { src: Images.heroImage, title: "Modern Campus", category: "Campus Life" },
    { src: Images.studentImage, title: "Student Excellence", category: "Students" },
    { src: Images.lecturerImage, title: "Expert Faculty", category: "Faculty" },
    { src: Images.adminImage, title: "Administrative Excellence", category: "Administration" },
    { src: Images.heroImage, title: "Learning Spaces", category: "Facilities" },
    { src: Images.studentImage, title: "Collaborative Learning", category: "Activities" },
  ];

  return (
    <section className="relative bg-gray-50 py-12 md:py-16 overflow-hidden">
      {/* Decorative Background Elements - Orange & Dark Blue */}
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-orange-600 rounded-full blur-3xl animate-glow-pulse"></div>
      <div className="absolute bottom-20 left-20 w-[450px] h-[450px] bg-blue-900 rounded-full blur-3xl animate-glow-pulse-delayed"></div>

      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Campus Gallery
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our state-of-the-art facilities, vibrant campus life, and academic excellence through our photo gallery
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all shadow-md hover:shadow-xl"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-[4/3] bg-gray-200">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-xs font-semibold text-orange-300 mb-1">{image.category}</div>
                  <h3 className="text-lg font-bold">{image.title}</h3>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Updated CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl border-2 border-gray-200 p-8 gap-6"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Experience UNIDEL Firsthand</h3>
            <p className="text-gray-600">
              Visit our campus to explore world-class facilities, meet our distinguished faculty, and discover why UNIDEL is the right choice for your academic journey.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all whitespace-nowrap">
            Schedule Tour
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto rounded-2xl"
            />
            <div className="mt-4 text-center text-white">
              <div className="text-sm text-orange-300">{selectedImage.category}</div>
              <div className="text-xl font-bold mt-1">{selectedImage.title}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;