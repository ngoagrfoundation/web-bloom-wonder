import ProgramPageLayout from "@/components/ProgramPageLayout";
import educationImage from "@/assets/education-program.jpg";

const Education = () => {
  return (
    <ProgramPageLayout
      title="Education for All"
      tagline="Providing access to quality education through community learning centers, scholarships, and after-school programs for underprivileged children."
      heroImage={educationImage}
      overview="Education is the foundation of empowerment. Our Education for All program focuses on bridging the educational gap for children from marginalized communities. We operate community learning centers, provide scholarships to deserving students, run after-school tutoring programs, and work with local schools to improve educational infrastructure. Our goal is to ensure that every child, regardless of their socio-economic background, has access to quality education and the opportunity to build a brighter future."
      activities={[
        {
          title: "Community Learning Centers",
          description: "We run learning centers in underserved areas providing supplementary education, computer training, and life skills development.",
        },
        {
          title: "Scholarship Programs",
          description: "Merit-based and need-based scholarships for students from Class 1 through higher education, covering fees, books, and uniforms.",
        },
        {
          title: "After-School Tutoring",
          description: "Free tutoring sessions for children who need extra academic support, helping them keep up with their peers.",
        },
        {
          title: "School Infrastructure",
          description: "Improving school facilities by building classrooms, providing furniture, and setting up computer labs in rural schools.",
        },
        {
          title: "Teacher Training",
          description: "Workshops and training programs for teachers to adopt modern, child-friendly teaching methodologies.",
        },
        {
          title: "Digital Literacy",
          description: "Equipping students with essential computer skills and internet literacy for the modern world.",
        },
      ]}
      stats={[
        { value: "5,000+", label: "Students Supported" },
        { value: "15", label: "Learning Centers" },
        { value: "500+", label: "Scholarships Given" },
        { value: "25+", label: "Schools Improved" },
      ]}
      relatedFocus={[
        { title: "Skill Development", link: "/focus/skill-development" },
        { title: "Women's Empowerment", link: "/focus/womens-empowerment" },
        { title: "Rural Development", link: "/focus/rural-development" },
      ]}
    />
  );
};

export default Education;
