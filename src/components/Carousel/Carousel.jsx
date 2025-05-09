import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ImageCarousel({ images }) {
  const [imagesToShow, setImagesToShow] = useState([]);

  useEffect(() => {
    const imagesToShow = images.map((image, index) => (
      <div data-index={index} key={image}>
        <img
          src={image}
          alt={`Image ${index}`}
          style={{ maxWidth: "70%"}}
        />
      </div>
      
    ));
    setImagesToShow(imagesToShow);
  }, [images]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    respondTo: "window",
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: "10em"
  };

  return (

      <Slider {...settings} >
        {imagesToShow}
      </Slider>

  );
}
