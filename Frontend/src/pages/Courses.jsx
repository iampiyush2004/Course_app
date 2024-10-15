import Card from "../components/card";

function Courses() {
  const data = [
    {
      "_id": "1",
      "title": "Full Stack Development",
      "description": "Learn to build complete web applications from scratch.",
      "imageLink": "https://via.placeholder.com/300.png/09f/fff",
      "price": 5999,
    },
    {
      "_id": "2",
      "title": "Data Science Bootcamp",
      "description": "Become a data scientist with hands-on projects.",
      "imageLink": "https://via.placeholder.com/300.png/1f1/fff",
      "price": 6999,
    },
    {
      "_id": "3",
      "title": "Digital Marketing Essentials",
      "description": "Master the basics of digital marketing strategies.",
      "imageLink": "https://via.placeholder.com/300.png/2f2/fff",
      "price": 3999,
    },
    {
      "_id": "4",
      "title": "UI/UX Design",
      "description": "Learn how to design user-friendly interfaces.",
      "imageLink": "https://via.placeholder.com/300.png/3f3/fff",
      "price": 4999,
    },
    {
      "_id": "5",
      "title": "Mobile App Development",
      "description": "Create engaging mobile applications for Android and iOS.",
      "imageLink": "https://via.placeholder.com/300.png/4f4/fff",
      "price": 7999,
    },
    {
      "_id": "6",
      "title": "Cybersecurity Fundamentals",
      "description": "Understand the basics of protecting systems and networks.",
      "imageLink": "https://via.placeholder.com/300.png/5f5/fff",
      "price": 2999,
    },
  ];

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          data.map((val) => (
            <Card 
              key={val._id}
              title={val.title} 
              description={val.description} 
              imageLink={val.imageLink} 
              price={val.price} 
            />
          ))
        }
      </div>
    </div>
  );
}

export default Courses;
