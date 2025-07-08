import React from 'react';
import BookList from './Booklist';

const Home = () => {
  return (
    <div className="text-center mt-10">
      
     
      {/* Book list appears below the welcome text */}
      <div className="mt-10">
        <BookList />
      </div>
    </div>
  );
};

export default Home;

