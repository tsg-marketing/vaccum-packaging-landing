import { useEffect, useRef, useState } from 'react';
import '../styles/messengers.css';

export default function Messengers() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [wrapperInitHeight, setWrapperInitHeight] = useState(0);

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperInitHeight(wrapperRef.current.getBoundingClientRect().height);
    }
  }, []);

  const toggle = () => {
    if (wrapperRef.current && listRef.current) {
      const wrapperHeight = Math.round(wrapperRef.current.getBoundingClientRect().height);
      const listHeight = Math.round(listRef.current.getBoundingClientRect().height);
      
      if (wrapperHeight !== listHeight) {
        setIsOpen(true);
        wrapperRef.current.style.height = listHeight + 'px';
      } else {
        setIsOpen(false);
        wrapperRef.current.style.height = wrapperInitHeight + 'px';
      }
    }
  };

  return (
    <div className="messengers" onClick={toggle}>
      <button className={`messengers-toggler ${isOpen ? 'opened' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </button>
      
      <div className="messengers-list-wrapper" ref={wrapperRef}>
        <ul className="messengers-list" ref={listRef}>
          <li className="messengers-item whatsapp">
            <a href="https://wa.me/74951471362" target="_blank" rel="noopener noreferrer">
              <span></span>
            </a>
          </li>
          <li className="messengers-item telegram">
            <a href="https://t.me/+74951471362" target="_blank" rel="noopener noreferrer">
              <span></span>
            </a>
          </li>
          <li className="messengers-item phone">
            <a href="tel:+74951471362">
              <span></span>
            </a>
          </li>
          <li className="messengers-item mail">
            <a href="mailto:info@example.com">
              <span></span>
            </a>
          </li>
          <li className="messengers-item callback">
            <button type="button" onClick={(e) => {
              e.stopPropagation();
            }}>
              <span></span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}