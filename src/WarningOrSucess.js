import { useEffect,useState } from "react";
function GiveError({message,duration,show,onClose})
{
    const [visible, setVisible] = useState(show);

    useEffect(() => { setVisible(show); }, [show]);

    useEffect(() => 
    { 
        if (!visible) return;

        const timer = setTimeout(() => { 
            setVisible(false);
            onClose && onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [visible, duration, onClose]);

  if (!visible) return null;
  return(
    <div className="error-toast animate__animated animate__zoomIn ">
      <span> {message}</span>
      <div
        className="error-timeline"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}


function TypingEffect({ text }) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50); 

      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <h5>{displayText}</h5>;
}


export {GiveError,TypingEffect};
