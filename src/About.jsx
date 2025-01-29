import React from 'react';
import './about.css'; 

const About = () => {
    return (
        <div className="about-us p-4 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-4">Welcome to On-a Budget Meals!</h1>
            <p className="text-lg text-gray-700 mb-2">
                We made this website because, as students, we know how hard it can be to choose a meal when money is tight. 
                This website is for anyone on a budget. 
            </p>
            <p className="text-lg text-gray-700 mb-2">
                You’ll find simple recipes for breakfast, lunch, and dinner, based on how much money you have 
                whether it’s $10, $20, or $30. Don’t compromise what you eat just because you don’t have a lot of money!
            </p>
        </div>
    );
};

export default About;
