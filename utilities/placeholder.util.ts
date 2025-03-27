import Icon1 from '../assets/svgImages/gallery blossom.svg';
import Icon2 from '../assets/svgImages/gallery emarald.svg';
import Icon3 from '../assets/svgImages/gallery lavender.svg';
import Icon4 from '../assets/svgImages/gallery butter.svg';

export function getRandomColor(name?: string) {
  const colors = [
    { dark: '#D16D9A', light: '#F8F1F4', icon: Icon1 as JSX.ElementType },
    { dark: '#938BE6', light: '#F0F0FA', icon: Icon3 as JSX.ElementType },
    { dark: '#E7C546', light: '#FBF9E9', icon: Icon4 as JSX.ElementType },
    { dark: '#02B683', light: '#E3FBF4', icon: Icon2 as JSX.ElementType }
  ];
  let random = colors[0];

  if (name) {
    const index = name.charCodeAt(0) % colors.length;
    random = colors[index];
  } else {
    random = colors[Math.floor(Math.random() * colors.length)];
  }

  return random;
}
