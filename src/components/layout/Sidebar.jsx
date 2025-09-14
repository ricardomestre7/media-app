
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Video, Image as ImageIcon, FileBox as FileGifBox, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: "/", icon: Home, label: "Tudo" },
  { to: "/videos", icon: Video, label: "Vídeos" },
  { to: "/images", icon: ImageIcon, label: "Imagens" },
  { to: "/gifs", icon: FileGifBox, label: "GIFs" },
  { to: "/audios", icon: Music, label: "Áudios" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-700/50 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
          className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center"
        >
          <ImageIcon className="text-white h-6 w-6" />
        </motion.div>
        <span className="text-xl font-bold text-white">MediaHub</span>
      </div>
      <nav className="flex flex-col gap-2 mt-6">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-400'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
  