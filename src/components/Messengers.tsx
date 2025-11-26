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
        <span></span>
        <span></span>
        <span></span>
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
