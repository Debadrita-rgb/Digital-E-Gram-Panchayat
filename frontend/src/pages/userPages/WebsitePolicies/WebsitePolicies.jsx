import React from "react";

const WebsitePolicies = () => {
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
          <h1 className="text-white text-3xl font-bold">Website Policies</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-10 space-y-8 text-justify max-w-7xl mx-auto px-4 py-12 shadow-[0_10px_40px_rgba(0,255,255,0.2)]">
        {/* COPYRIGHT POLICY */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            COPYRIGHT POLICY
          </h2>
          <p>
            Material featured on this website may be reproduced free of charge
            and there is no need for any prior approval for using the content.
            The permission to reproduce this material shall not extend to any
            third-party material. Authorisation to reproduce such material must
            be obtained from the ministry. The material must be reproduced
            accurately and not used in a derogatory manner or in a misleading
            context. Wherever the material is being published or issued to
            others, the source must be acknowledged.
          </p>
        </section>

        {/* PRIVACY POLICY */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            PRIVACY POLICY
          </h2>
          <p>
            MoPR-Website does not automatically capture any specific personal
            information from you, (like name, phone number or e-mail address),
            that allows us to identify you individually.
            <br />
            <br />
            If the MoPR-Website requests you to provide personal information,
            you will be informed for the particular purposes for which the
            information is gathered and adequate security measures will be taken
            to protect your personal information.
            <br />
            <br />
            We do not sell or share any personally identifiable information
            volunteered on the MoPR-Website to any third party (public/private).
            Any information provided to this website will be protected from
            loss, misuse, unauthorized access or disclosure, alteration, or
            destruction.
            <br />
            <br />
            We gather certain information about the User, such as Internet
            protocol (IP) addresses, domain name, browser type, operating
            system, the date and time of the visit and the pages visited. We
            make no attempt to link these addresses with the identity of
            individuals visiting our site unless an attempt to damage the site
            has been detected.
            <br />
            <br />A cookie is a piece of software code that an internet web site
            sends to your browser when you access information at that site. This
            site does not use cookies.
          </p>
        </section>

        {/* HYPER LINKING POLICY */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            HYPER LINKING POLICY
          </h2>
          <p>
            <strong>Links to external websites/portals:</strong> At many places
            in this website, you shall find links to other websites/portals.
            These links have been placed for your convenience. MoPR is not
            responsible for the contents and reliability of the linked websites
            and does not necessarily endorse the views expressed in them. Mere
            presence of the link or its listing on this website should not be
            assumed as endorsement of any kind.
            <br />
            <br />
            We cannot guarantee that these links will work all the time and we
            have no control over the availability of linked pages.
            <br />
            <br />
            <strong>Links to MoPR Website by other websites/portals:</strong> We
            do not object to linking directly to the information that is hosted
            on MoPR’s site but it is necessary that prior permission is taken
            before hyperlinks are directed from any website to this site.
            Permission for the same, stating the nature of the content on the
            pages from where the link has to be given and the exact language of
            the hyperlink should be obtained by sending a request to
            ‘epanchayat_mopr@googlegroups.com’.
            <br />
            <br />
            Also, it is not permitted that our pages be loaded into frames on
            the requested site. Our Department’s pages must load into a newly
            opened browser window of the user.
          </p>
        </section>

        {/* TERMS & CONDITIONS */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            TERMS & CONDITIONS
          </h2>
          <p>
            Website is designed & hosted by National Informatics Centre,
            Contents provided by MoPR. Though all efforts have been made to
            ensure the accuracy and currency of the content on this website, the
            same should not be construed as a statement of law or used for any
            legal purposes.
            <br />
            <br />
            In case of any ambiguity or doubts, users are advised to
            verify/check with the MoPR and/or other source(s), and to obtain
            appropriate professional advice. Under no circumstances will MoPR be
            liable for any expense, loss or damage including, without
            limitation, indirect or consequential loss or damage, or any
            expense, loss or damage whatsoever arising from use, or loss of use,
            of data, arising out of or in connection with the use of this
            website.
            <br />
            <br />
            These terms and conditions shall be governed by and construed in
            accordance with the Indian Laws. Any dispute arising under these
            terms and conditions shall be subject to the jurisdiction of the
            courts of India.
            <br />
            <br />
            The information posted on this website could include hypertext links
            or pointers to information created and maintained by non-Government
            / private organisations. MoPR is providing these links and pointers
            solely for your information and convenience.
            <br />
            <br />
            When you select a link to an outside website, you are leaving the
            MoPR website and are subject to the privacy and security policies of
            the owners/sponsors of the outside website. MoPR does not guarantee
            the availability of such linked pages at all times. MoPR cannot
            authorise the use of copyrighted materials contained in linked
            websites. Users are advised to request such authorisation from the
            owner of the linked website. MoPR does not guarantee that linked
            websites comply with Indian Government Web Guidelines.
          </p>
        </section>

        {/* DISCLAIMER */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            DISCLAIMER
          </h2>
          <p>
            This website of the MoPR is being maintained for information
            purposes only. Even though every effort is taken to provide accurate
            and up to date information, officers making use of the circulars
            posted on the website are advised to get in touch with the MoPR
            whenever there is any doubt regarding the correctness of the
            information contained therein.
            <br />
            <br />
            In the event of any conflict between the contents of the circulars
            on the website and the hard copy of the circulars issued by MoPR,
            the information in the hard copy should be relied upon and the
            matter shall be brought to the notice of the MoPR.
          </p>
        </section>
      </div>
    </div>
  );
};

export default WebsitePolicies;
