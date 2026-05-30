import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="card-interactive p-8 fade-up"
      style={{ animationDelay: `${delay}ms` }}
      data-testid={`feature-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
