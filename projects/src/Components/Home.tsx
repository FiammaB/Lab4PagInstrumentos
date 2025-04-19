import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slider1 from '../assets/img/slider1.jpg';
import slider2 from '../assets/img/slider2.jpg';
import slider3 from '../assets/img/slider3.jpg';
import '../styles.css'; // Importamos los estilos

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="container my-4">
      <Slider {...settings} className="home-slider">
        <div>
          <img 
            src={slider1}
            className="slider-image" 
            alt="Instrumento 1" 
          />
        </div>
        <div>
          <img 
            src={slider2} 
            className="slider-image" 
            alt="Instrumento 2" 
          />
        </div>
        <div>
          <img 
            src={slider3}
            className="slider-image" 
            alt="Instrumento 3" 
          />
        </div>
      </Slider>
      
      <h1 className="home-title m-4">Musical Hendrix</h1>
      <p className="home-description">
        Musical Hendrix es una tienda de instrumentos musicales con ya más de 15 años de
        experiencia. Tenemos el conocimiento y la capacidad como para informarte acerca de las
        mejores elecciones para tu compra musical.
      </p>
    </div>
  );
};

export default Home;