import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ReturnRefundPolicyPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        <section className="container-main section-padding">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <p className="section-label">Legal</p>

              <h1 className="section-title">
                Return &amp; Refund Policy
              </h1>

              <p className="mt-4 max-w-3xl text-[15px] font-normal leading-7 text-[var(--text-muted)]">
                We want you to receive your products in good condition. Please
                review the following policy before placing an order with Jaji
                Electronics.
              </p>
            </div>

            <div className="space-y-10 text-[15px] font-normal leading-7 text-[var(--text)]">
              {/* Section 1 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  1. Damaged or Incorrect Products
                </h2>

                <div className="mt-3 space-y-4">
                  <p>
                    If you receive a product that is damaged, defective, or
                    different from the product you ordered, please contact
                    Jaji Electronics as soon as possible after delivery.
                  </p>

                  <p>
                    Please keep the product, original packaging, accessories,
                    manuals, and any other items supplied with the order until
                    the issue has been reviewed.
                  </p>

                  <p>
                    We may request photographs, videos, or other information
                    to help us understand and assess the condition of the
                    product.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  2. Return Requests
                </h2>

                <div className="mt-3 space-y-4">
                  <p>
                    Return requests are reviewed based on the condition of the
                    product and the circumstances of the order. A return must
                    be approved by Jaji Electronics before the product is sent
                    back.
                  </p>

                  <p>
                    Customers should contact us before arranging or shipping
                    any return. We will provide instructions regarding the
                    return process where a return is approved.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  3. Product Condition
                </h2>

                <div className="mt-3 space-y-4">
                  <p>
                    Products approved for return should generally be returned
                    in their original condition, together with the packaging,
                    accessories, manuals, warranty documents, and other items
                    supplied with the product, where applicable.
                  </p>

                  <p>
                    Products that have been significantly damaged, modified,
                    improperly installed, or used in a manner inconsistent
                    with their intended purpose may not qualify for return.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  4. Refunds
                </h2>

                <div className="mt-3 space-y-4">
                  <p>
                    Where a refund is approved, Jaji Electronics will
                    communicate the applicable refund method and processing
                    details to the customer based on the circumstances of the
                    order.
                  </p>

                  <p>
                    As our current payment method is Cash on Delivery, refund
                    arrangements may be handled separately depending on the
                    nature of the return and the payment information available
                    to us.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  5. Non-Returnable Situations
                </h2>

                <p className="mt-3">
                  Returns may not be accepted where a product has been damaged
                  after delivery through misuse, improper installation,
                  unauthorized repairs, accidental damage, negligence, or
                  other customer handling issues. Products may also be
                  ineligible for return where required accessories, packaging,
                  or other supplied items are missing.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  6. Exchanges and Replacements
                </h2>

                <p className="mt-3">
                  Where a product is confirmed to be damaged, defective, or
                  incorrectly supplied, Jaji Electronics may, depending on the
                  circumstances and product availability, offer a replacement
                  or another appropriate resolution.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  7. Delivery and Return Costs
                </h2>

                <p className="mt-3">
                  Any delivery or return-related costs will be handled
                  according to the circumstances of the return and will be
                  communicated to the customer when the return is reviewed.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--dark)] sm:text-xl">
                  8. Contact Us
                </h2>

                <p className="mt-3">
                  To discuss a return, replacement, or refund request, please
                  contact Jaji Electronics using the details below.
                </p>

                <div className="mt-4 space-y-2">
                  <p>
                    <span className="font-semibold text-[var(--dark)]">
                      Phone:
                    </span>{" "}
                    <a
                      href="tel:03359864000"
                      className="text-[var(--primary)] hover:underline"
                    >
                      0335 9864000
                    </a>
                  </p>

                  <p>
                    <span className="font-semibold text-[var(--dark)]">
                      Email:
                    </span>{" "}
                    <a
                      href="mailto:jajielectronics97@gmail.com"
                      className="text-[var(--primary)] hover:underline"
                    >
                      jajielectronics97@gmail.com
                    </a>
                  </p>

                  <p>
                    <span className="font-semibold text-[var(--dark)]">
                      Address:
                    </span>{" "}
                    Shaheen Market, Karkhano, Peshawar, Pakistan
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}