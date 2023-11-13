import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";

const Carousel = () => {
  // 轮播图设置
  const settings = {
    dots: true, // 显示点状指示器
    infinite: true, // 无限循环播放
    speed: 500, // 切换速度
    slidesToShow: 1, // 同时显示的幻灯片数
    slidesToScroll: 1, // 每次滚动的幻灯片数
    autoplay: true, // 自动播放
    autoplaySpeed: 2000, // 自动播放速度
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src="/carousel/hotel.png" alt="Image 1" />
        </div>
        <div>
          <img src="/carousel/lobby.png" alt="Image 2" />
        </div>
        <div>
          <img src="/carousel/room.png" alt="Image 3" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
