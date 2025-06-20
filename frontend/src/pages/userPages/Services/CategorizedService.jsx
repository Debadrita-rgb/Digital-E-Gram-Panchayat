import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
  
const CategorizedService = () => {
    const { categoryId } = useParams();
    const [services, setServices] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setcategoryImage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchCategorizedServices = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/user/categorized-services/${categoryId}`
          );
          setServices(res.data.services || []);
          setCategoryName(res.data.categoryName || "Services");
          setcategoryImage(
            res.data.categoryImage ||
              "https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/202502061433080426.jpeg"
          );
        } catch (error) {
          console.error("Error loading categorized services", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategorizedServices();
    }, [categoryId]);

    if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="mx-auto px-4 py-5 lg:mt-20">
      <div
        className="relative w-full h-64 rounded-xl overflow-hidden mb-10 shadow-md"
        style={{
          backgroundImage: `url(${categoryImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-transparent bg-opacity-50 flex items-center justify-center">
          <h1 className="text-black text-3xl md:text-4xl font-bold text-center">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        {services.map((service) => (
          <Link key={service._id} to={`/view-service/${service._id}`}>
            <div
              key={service._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={service.image || "https://via.placeholder.com/400x300"}
                alt={service.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {service.name}
                </h3>
                <p
                  className="text-gray-600 dark:text-gray-300 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: service.description?.slice(0, 180) + "...",
                  }}
                ></p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategorizedService
