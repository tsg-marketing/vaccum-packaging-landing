import { useState } from 'react';
import Icon from '@/components/ui/icon';
import '../styles/messengers.css';

export default function Messengers() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="messengers">
      {isOpen && (
        <div className="messengers-list-wrapper">
          <ul className="messengers-list">
            <li className="messengers-item">
              <a href="https://wa.me/74951471362" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                <Icon name="MessageCircle" size={32} className="text-green-500" />
              </a>
            </li>
            <li className="messengers-item">
              <a href="https://t.me/+74951471362" target="_blank" rel="noopener noreferrer" title="Telegram">
                <Icon name="Send" size={32} className="text-blue-500" />
              </a>
            </li>
            <li className="messengers-item">
              <a href="tel:+74951471362" title="Позвонить">
                <Icon name="Phone" size={32} className="text-orange-500" />
              </a>
            </li>
            <li className="messengers-item">
              <a href="mailto:info@example.com" title="Email">
                <Icon name="Mail" size={32} className="text-red-500" />
              </a>
            </li>
          </ul>
        </div>
      )}
      
      <button className={`messengers-toggler ${isOpen ? 'opened' : ''}`} onClick={toggle}>
        <Icon name="Phone" size={28} />
      </button>
    </div>
  );
}