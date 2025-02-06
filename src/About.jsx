import React, { useState } from 'react';
import './about.css';



const AboutUs = () => {
  const [activeCard, setActiveCard] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Stevenson Jean",
      role: "Front-end Developer",
      image: "https://i.pinimg.com/originals/23/20/f6/2320f6a8ea388dc214fd7a8544427c70.png",
      price: "Information Technology (IT)"
    },
    {
      id: 2,
      name: "Yorfi Guzman",
      role: "Front-end Designer",
      image: "https://img.freepik.com/premium-vector/hand-drawn-young-woman-cooking-kitchen-cartoon-smiling-character-with-apron_905829-5150.jpg?w=2000",
      price: "Information Technology (IT)"
    },
    {
        id: 3,
        name: "Alejandro Forman",
        role: "Back-end Developer",
        image: "https://ichef.bbci.co.uk/images/ic/1200x675/p0hfwjv1.jpg",
        price: "Information Technology (IT)"
      },
      {
        id: 4,
        name: "Ben Abraham",
        role: "Back-end Designer",
        image: "https://img.freepik.com/premium-photo/smiling-chef-cartoon-character-holding-tasty-dish_883103-711.jpg?w=2000",
        price: "Information Technology (IT)"
      },
  ];

  const handleCardClick = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="about-us">
      <div className="about-text-box">
        <h1>About Us</h1>
        <p>
        "We created this website with the understanding that selecting meals can be challenging,
        especially for students managing a tight budget. This platform is designed for anyone looking to save money. 
        You will find simple and affordable recipes for breakfast, lunch, and dinner, categorized by budget levels of $10, $20, and $30. 
        Enjoy nutritious and delicious meals without compromising on quality, regardless of your budget."
        </p>
      </div>

      <img 
        src="https://assets.onecompiler.app/43757a92k/437575bgx/vegetable%20collage%20(2).png" 
        alt="Our kitchen workspace"
        className="section-divider-image"
      />

      <h2>Meet Our Team</h2>
      
      <div className="container">
        {teamMembers.map((member) => (
          <div 
            key={member.id}
            className={`about-box ${activeCard === member.id ? 'flipped' : ''}`}
            onClick={() => handleCardClick(member.id)}
          >
            <div className="front">
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p className="price">{member.price}</p>
            </div>
            
            <div className="back">
              <h3>{member.name}</h3>
              <p>{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
