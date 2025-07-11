import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courses = [
  {
    title: "AutoCAD Professional",
    category: "Mechanical Eng",
    duration: "8 weeks",
    description:
      "Master 2D and 3D design for mechanical engineering applications.",
    detailedDescription:
      "<p>This comprehensive course covers all aspects of AutoCAD for mechanical engineering. You'll learn:</p><ul><li>2D drafting and annotation</li><li>3D modeling and visualization</li><li>Mechanical design workflows</li><li>Industry best practices</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 899,
    rating: 4.8,
  },
  {
    title: "SolidWorks",
    category: "Mechanical Eng",
    duration: "6 weeks",
    description: "Learn parametric 3D CAD design with SolidWorks.",
    detailedDescription:
      "<p>This course teaches you how to:</p><ul><li>Create 3D parts and assemblies</li><li>Generate engineering drawings</li><li>Perform simulations</li><li>Create sheet metal parts</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a9e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 799,
    rating: 4.7,
  },
  {
    title: "Electrical AutoCAD",
    category: "Electrical Eng",
    duration: "4 weeks",
    description: "Specialized AutoCAD training for electrical systems design.",
    detailedDescription:
      "<p>Learn to design:</p><ul><li>Electrical control systems</li><li>Power distribution</li><li>Circuit diagrams</li><li>Panel layouts</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 699,
    rating: 4.5,
  },
  {
    title: "PLC Programming",
    category: "Electrical Eng",
    duration: "6 weeks",
    description: "Program and troubleshoot Programmable Logic Controllers.",
    detailedDescription:
      "<p>Course covers:</p><ul><li>Ladder logic programming</li><li>HMI integration</li><li>Industrial automation</li><li>Troubleshooting techniques</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 899,
    rating: 4.6,
  },
  {
    title: "Arduino Programming",
    category: "Electronic Eng",
    duration: "4 weeks",
    description: "Learn to program and build projects with Arduino.",
    detailedDescription:
      "<p>You'll learn:</p><ul><li>Basic electronics</li><li>Arduino programming</li><li>Sensor integration</li><li>Project development</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1627855437693-dcc7b0c4ba7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 599,
    rating: 4.7,
  },
  {
    title: "PCB Designing",
    category: "Electronic Eng",
    duration: "6 weeks",
    description: "Design and fabricate printed circuit boards.",
    detailedDescription:
      "<p>Course includes:</p><ul><li>Schematic design</li><li>PCB layout</li><li>Design rules</li><li>Manufacturing process</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 799,
    rating: 4.8,
  },
  {
    title: "Frontend Development",
    category: "Computer Sci Eng",
    duration: "8 weeks",
    description: "Build modern web interfaces with HTML, CSS, and JavaScript.",
    detailedDescription:
      "<p>Learn:</p><ul><li>HTML5 and CSS3</li><li>JavaScript fundamentals</li><li>Responsive design</li><li>Frontend frameworks</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 999,
    rating: 4.9,
  },
  {
    title: "Python Programming",
    category: "Computer Sci Eng",
    duration: "6 weeks",
    description: "From basics to advanced Python programming concepts.",
    detailedDescription:
      "<p>Covers:</p><ul><li>Python syntax</li><li>Data structures</li><li>OOP concepts</li><li>File handling</li></ul>",
    imageUrl:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 899,
    rating: 4.8,
  },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();

  // Create courses
  for (const course of courses) {
    await prisma.course.create({
      data: course,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
