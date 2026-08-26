import './Spinner.css';

export default function Spinner({ size = '20px' }) {
  return (
    <div 
      className="spinner" 
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    ></div>
  );
}
