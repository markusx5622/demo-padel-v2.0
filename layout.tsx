@import "tailwindcss";

@theme {
  --color-neon: #ccff00;
}

.padel-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.text-outline-neon {
  color: transparent;
  -webkit-text-stroke: 1px #ccff00;
}

.input-neon:focus {
  outline: none;
  border-color: #ccff00;
  box-shadow: 0 0 15px rgba(204, 255, 0, 0.3);
}