<template>
  <div class="min-h-screen bg-gray-50">
    <Banner
      backgroundImage="/images/privacy-policy.jpg"
      title="Privacy Policy & Terms"
      description="Your privacy and our terms of service are important to us. Learn how we protect your information and the terms that govern our services."
    />

    <!-- Navigation Tabs -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4">
        <div class="flex space-x-8">
          <button 
            @click="activeTab = 'privacy'"
            :class="[
              'py-4 px-2 border-b-2 font-semibold transition-colors',
              activeTab === 'privacy' 
                ? 'border-secondary text-secondary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            Privacy Policy
          </button>
          <button 
            @click="activeTab = 'terms'"
            :class="[
              'py-4 px-2 border-b-2 font-semibold transition-colors',
              activeTab === 'terms' 
                ? 'border-secondary text-secondary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            Terms & Conditions
          </button>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Privacy Policy Content -->
        <div v-if="activeTab === 'privacy'" class="space-y-8">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
            
            <div class="prose prose-lg max-w-none">
              <p class="text-gray-700 leading-relaxed mb-6">
                Welcome to Dynamo Stitches, where your privacy is as important to us as the art we create. This Privacy Policy is our commitment to transparency, explaining how we collect, use, protect, and disclose your personal information. By engaging with our website or services, you trust us with your information, and we take that trust seriously.
              </p>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">What Information Do We Collect?</h3>
                <p class="text-gray-700 mb-4">When you visit our website or use our services, we may collect various types of information, including:</p>
                <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Personal Information:</strong> Your name, email address, phone number, and shipping address, which you provide when placing an order or contacting us.</li>
                  <li><strong>Payment Information:</strong> Your billing information and payment method, which are securely processed by our payment processors.</li>
                  <li><strong>Usage Information:</strong> Information about how you interact with our website, such as your IP address, browser type, and device identifiers.</li>
                  <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your browsing experience and analyze how our website is used.</li>
                </ul>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">How Do We Use Your Information?</h3>
                <p class="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
                <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>To Provide Services:</strong> Fulfilling your orders, processing payments, and delivering products to you.</li>
                  <li><strong>To Communicate:</strong> Sending you order updates, responding to your inquiries, and providing customer support.</li>
                  <li><strong>To Improve:</strong> Analyzing trends and user interactions to enhance our website, products, and services.</li>
                  <li><strong>To Comply:</strong> Meeting legal and regulatory requirements.</li>
                </ul>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">How Do We Protect Your Information?</h3>
                <p class="text-gray-700 leading-relaxed">
                  We take the security of your information seriously and have implemented a variety of security measures to protect it from unauthorized access, disclosure, alteration, or destruction. We use industry-standard encryption protocols to safeguard your data during transmission.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h3>
                <p class="text-gray-700 leading-relaxed">
                  We may use third-party services to help us operate our business and provide our services, such as payment processors and shipping partners. These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Your Choices and Rights</h3>
                <p class="text-gray-700 leading-relaxed">
                  You have the right to access, update, or delete your personal information. If you wish to exercise these rights or have any questions about our Privacy Policy, please contact us.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Updates to Our Privacy Policy</h3>
                <p class="text-gray-700 leading-relaxed">
                  We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes will be posted on this page, so please review it periodically.
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h3>
                <p class="text-gray-700 leading-relaxed">
                  If you have any questions or concerns about our Privacy Policy or our practices regarding your personal information, please contact us at <a href="mailto:info@dynamostitches.com" class="text-secondary hover:underline">info@dynamostitches.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions Content -->
        <div v-if="activeTab === 'terms'" class="space-y-8">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
            
            <div class="prose prose-lg max-w-none">
              <p class="text-gray-700 leading-relaxed mb-6">
                By accessing and using our website, you agree to comply with the following terms and conditions of use. If you do not agree to these terms, please refrain from using our website. Dynamo Stitches reserves the right to revise these terms, so please review them regularly. All information on the site is subject to change without notice.
              </p>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Accuracy and Timeliness of Information</h3>
                <p class="text-gray-700 leading-relaxed">
                  Dynamo Stitches strives to provide accurate and timely information. However, all information and material on the website, including text, graphics, and links, as well as products and services, are provided on an "as is" and "as available" basis. We do not warrant that this site or its contents will be complete, accurate, uninterrupted, secure, or error-free, or that the site or the servers used will be free of viruses.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Cookies</h3>
                <p class="text-gray-700 leading-relaxed">
                  We employ the use of cookies. By accessing Dynamo Stitches, you agree to use cookies in agreement with Dynamo Stitches' Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">License</h3>
                <p class="text-gray-700 mb-4">
                  Unless otherwise stated, Dynamo Stitches and/or its licensors own the intellectual property rights for all material on Dynamo Stitches. All intellectual property rights are reserved. You may access this from Dynamo Stitches for your own personal use, subject to restrictions set in these terms and conditions.
                </p>
                <p class="text-gray-700 mb-4">You must not:</p>
                <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Republish material from Dynamo Stitches</li>
                  <li>Sell, rent or sub-license material from Dynamo Stitches</li>
                  <li>Reproduce, duplicate or copy material from Dynamo Stitches</li>
                  <li>Redistribute content from Dynamo Stitches</li>
                </ul>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h3>
                <p class="text-gray-700 leading-relaxed">
                  Customers can cancel orders, quotes, and vector requests within 6 hours.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h3>
                <p class="text-gray-700 leading-relaxed">
                  We will send the invoice to the customer when the order has been completed and delivered. Orders will be billed at the quoted price or, if a quote was not requested, based on the stitch count as mentioned above or as discussed with the Sales Manager. Special pricing may be available for volume orders. We accept Visa, MasterCard, American Express, and Discover. For terms, please contact us at our TOLL-FREE number.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Refund Policy</h3>
                <p class="text-gray-700 leading-relaxed">
                  We offer a 3-day money-back guarantee if you are not satisfied. Please submit a request to our Accounts and Administration Department for consideration.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Shipping Policy</h3>
                <p class="text-gray-700 leading-relaxed">
                  All orders, quotes, and vectors placed with Dynamo Stitches will be delivered via email or uploaded to our website. If physical delivery is requested, we will use air or ground courier services, with delivery charges added to the customer's bill.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Reservation of Rights</h3>
                <p class="text-gray-700 leading-relaxed">
                  We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                </p>
              </div>

              <div class="mb-8">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Removal of Links from Our Website</h3>
                <p class="text-gray-700 leading-relaxed">
                  If you find any link on our Website that is offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly. We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h3>
                <p class="text-gray-700 mb-4">
                  To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                </p>
                <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                  <li>limit or exclude our or your liability for death or personal injury.</li>
                  <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation.</li>
                  <li>limit any of our or your liabilities in any way that is not permitted under applicable law.</li>
                  <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                </ul>
                <p class="text-gray-700 leading-relaxed">
                  The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty. As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Banner from '@/components/Banner.vue'
const activeTab = ref('privacy')

// Set page title
useHead({
  title: 'Privacy Policy & Terms - Dynamo Stitches',
  meta: [
    { name: 'description', content: 'Privacy Policy and Terms & Conditions for Dynamo Stitches. Learn about how we protect your information and the terms that govern our services.' }
  ]
})
</script> 