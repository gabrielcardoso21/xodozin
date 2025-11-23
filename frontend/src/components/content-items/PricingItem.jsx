import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export default function PricingItem({ item }) {
  const navigate = useNavigate();

  if (!item.pricing_plan_ids || item.pricing_plan_ids.length === 0) {
    return null;
  }

  const handlePlanClick = (plan) => {
    if (plan.button_url) {
      if (plan.button_url.startsWith('http')) {
        window.open(plan.button_url, '_blank');
      } else {
        navigate(plan.button_url);
      }
    }
  };

  return (
    <div className="content-pricing">
      {item.title && (
        <h3 className="text-2xl font-bold text-[#Da2c38] mb-6 font-serif text-center">
          {item.title}
        </h3>
      )}
      {item.content && (
        <div 
          className="mb-8 text-[#463f3a] text-center"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {item.pricing_plan_ids.map((plan, index) => (
          <div
            key={plan.id || index}
            className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
              plan.highlighted ? 'ring-4 ring-[#da2c38] scale-105' : ''
            }`}
          >
            {plan.highlighted && (
              <div className="bg-[#da2c38] text-white text-center py-2 rounded-t-2xl -mt-6 -mx-6 mb-4">
                <span className="text-sm font-semibold">Mais Popular</span>
              </div>
            )}
            <h4 className="text-2xl font-bold text-[#Da2c38] mb-2 font-serif">
              {plan.name}
            </h4>
            <div className="mb-4">
              <span className="text-4xl font-bold text-[#da2c38]">
                {plan.currency || 'R$'}{plan.price.toFixed(2)}
              </span>
              {plan.period && (
                <span className="text-[#463f3a] ml-2">{plan.period}</span>
              )}
            </div>
            {plan.description && (
              <p className="text-[#463f3a] mb-4">{plan.description}</p>
            )}
            {plan.features && (
              <div 
                className="mb-6 text-[#463f3a]"
                dangerouslySetInnerHTML={{ __html: plan.features }}
              />
            )}
            <Button
              onClick={() => handlePlanClick(plan)}
              className={`w-full ${
                plan.highlighted
                  ? 'bg-[#da2c38] hover:bg-[#c02530] text-white'
                  : 'bg-transparent border-2 border-[#da2c38] text-[#da2c38] hover:bg-[#da2c38]/10'
              }`}
            >
              {plan.button_text || 'Escolher Plano'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
