export default function About() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container">
        <h2 className="text-3xl font-extrabold text-secondary text-center">
          About NKB I Infinity
        </h2>
        <div className="mt-8 max-w-3xl mx-auto space-y-6 text-gray-600">
          <p className="text-lg">
            NKB I Infinity (OPC) Pvt. Ltd. is a premier training institute dedicated to bridging the gap between academic learning and industry requirements.
          </p>
          <p className="text-lg">
            Our programs empower students with practical skills in:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Information Technology</li>
            <li>Finance</li>
            <li>Healthcare</li>
            <li>Engineering</li>
          </ul>
          <p className="text-lg">
            With a proven track record of transforming thousands of careers, we provide industry-relevant training to prepare students for professional success.
          </p>
        </div>
      </div>
    </section>
  );
}