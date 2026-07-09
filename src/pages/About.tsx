import Layout from '../components/Layout'
import './About.css'

export default function AboutPage() {
  return (
    <Layout>
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">Our story</p>
            <h2>internostudio13</h2>
          </div>
          <div className="about-content">
            <p>
              internostudio13 is built around structured silhouettes, soft textures, and versatile
                  pieces designed for everyday movement. We believe in quality over quantity —
                  each piece is chosen to last beyond a single season.
            </p>
            <p>
              From our earliest collections to today, our focus has stayed the same: thoughtful
              design, honest materials, and a wardrobe that works as hard as you do.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
