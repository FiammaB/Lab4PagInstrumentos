import React from 'react';


const DondeEstamos: React.FC = () => {
  return (
    <div >
      <h2 >Dónde Estamos</h2>
      <div className='container-fluid'>
        <iframe
          title="Ubicación Musical Hendrix"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.448239392947!2d-68.8418526848168!3d-32.88631587629095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091b7454f3a5%3A0x1f0c8a9e7c5f6b5d!2sAv.%20Las%20Heras%20%26%20Av.%20San%20Martin%2C%20Mendoza!5e0!3m2!1sen!2sar!4v1620000000000!5m2!1sen!2sar"
          allowFullScreen
          width="1200px"
          height="800px"
          loading="lazy"
        />
      </div>
     
    </div>
  );
};

export default DondeEstamos;
