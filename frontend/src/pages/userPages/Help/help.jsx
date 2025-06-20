import React from "react";

const Help = () => {
  return (
    <div className="mx-auto px-4 py-5 lg:mt-20 text-gray-800 dark:text-gray-200">
      {/* Banner */}
      <div
        className="relative w-full h-56 rounded-lg overflow-hidden mb-8"
        style={{
          backgroundImage: `url("https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2025/02/202502061433080426.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-opacity-60 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">Help</h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 md:p-10 space-y-8 text-justify max-w-7xl mx-auto px-4 py-12">
        {/* Intro */}
        <p>
          Are you finding it difficult to access/navigate through the
          content/pages of this Portal? This section attempts to help you have a
          pleasant experience while browsing this Portal.
        </p>

        {/* Accessibility */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Accessibility
          </h2>
          <p>
            We are committed to ensure that the site is accessible to all users
            irrespective of device in use, technology or ability. It has been
            built with an aim to provide maximum accessibility and usability to
            its visitors.
            <br />
            <br />
            Best efforts have been put to ensure that all information on this
            website is accessible to people with disabilities. For example, a
            user with visual disability can access this website using assistive
            technology such as a screen reader. Users with low vision can use
            high contrast and font size increase options.
            <br />
            <br />
            This website meets level{" "}
            <strong>
              AA of the Web Content Accessibility Guidelines (WCAG) 2.0
            </strong>{" "}
            laid down by the World Wide Web Consortium (W3C).
            <br />
            <br />
            If you have any problem or suggestion regarding the accessibility of
            this Site, please send a feedback to us.
          </p>
        </section>

        {/* Screen Reader Access */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Screen Reader Access
          </h2>
          <p>
            Our visitors with visual impairments can access the site using
            Assistive Technologies, such as screen readers.
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="p-2 border">Screen Reader</th>
                  <th className="p-2 border">Website</th>
                  <th className="p-2 border">Free / Commercial</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Screen Access For All (SAFA)",
                    "https://lists.sourceforge.net/lists/listinfo/safa-developer",
                    "Free",
                  ],
                  [
                    "Non Visual Desktop Access (NVDA)",
                    "http://www.nvda-project.org",
                    "Free",
                  ],
                  ["System Access To Go", "http://www.satogo.com", "Free"],
                  ["Thunder", "http://www.webbie.org.uk/thunder", "Free"],
                  [
                    "WebAnywhere",
                    "http://webinsight.cs.washington.edu/",
                    "Free",
                  ],
                  [
                    "Hal",
                    "http://www.yourdolphin.co.uk/productdetail.asp?id=5",
                    "Commercial",
                  ],
                  [
                    "JAWS",
                    "http://www.freedomscientific.com/Downloads/JAWS",
                    "Commercial",
                  ],
                  [
                    "Supernova",
                    "http://www.yourdolphin.co.uk/productdetail.asp?id=1",
                    "Commercial",
                  ],
                ].map(([name, url, type], i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-300 dark:border-gray-700"
                  >
                    <td className="p-2 border">{name}</td>
                    <td className="p-2 border text-blue-500 hover:underline">
                      <a href={url} target="_blank" rel="noreferrer">
                        {url}
                      </a>
                    </td>
                    <td className="p-2 border">{type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Viewing Files */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Viewing Information in Various File Formats
          </h2>
          <p>
            The information provided by this Web site is available in various
            file formats, such as Portable Document Format (PDF), Word, Excel
            and PowerPoint.
            <br />
            <br />
            To view the information properly, your browser needs to have the
            required plug-ins or software. For example, Adobe Flash software is
            required to view Flash files. In case your system does not have this
            software, you can download it from the Internet for free.
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="p-2 border">Document Type</th>
                  <th className="p-2 border">Plug-in for Download</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300 dark:border-gray-700">
                  <td className="p-2 border">
                    Portable Document Format (PDF) files
                  </td>
                  <td className="p-2 border">
                    <a
                      href="https://get.adobe.com/reader/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Adobe Acrobat Reader (External website)
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;
