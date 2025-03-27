import { Platform } from 'react-native';

const font = Platform.OS === 'ios' ? 'Avenir Next' : 'AvenirNextLTPro-Regular';

export const contextCSS = `font-family: ${font}; font-size: 16px; margin: 0; padding: 0; line-height: 26px`;

export const customCSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap');

body, p, div, h1, h2, h3, ol, ul, li {
  font-family: ${font}, 'Nunito', sans-serif;
  padding: 12;
  text-align: justify;
}
p {
  font-size: 16px;
  line-height: 26px;
}
h1 {
  font-size: 24px;
  line-height: 36px;
}
h2 {
  font-size: 20px;
  line-height: 30px;
}
h3 {
  font-size: 18px;
  line-height: 27px;
}
ol, ul {
  padding-left: 20px;
  margin: 0;
}
li {
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 5px;
}
  a {
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
}
`;
