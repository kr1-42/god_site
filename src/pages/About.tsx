import Layout from '../components/Layout'
import './About.css'

export default function AboutPage() {
  return (
    <Layout>
      <section className="about-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">Chi siamo</p>
            <h2>Interno 13 Studio</h2>
          </div>
          <div className="about-content">
            <p>
              Interno 13 Studio nasce a Firenze, città in cui la tradizione della pelletteria
              incontra una continua ricerca progettuale.
            </p>
            <p>
              Ogni creazione prende forma attraverso una lavorazione artigianale, dove ogni gesto
              è guidato dalla cura per i dettagli, dalla qualità dei materiali e dal desiderio di
              costruire oggetti destinati a durare.
            </p>
            <p>
              Il punto di partenza è sempre una forma essenziale. Da lì nasce un equilibrio fatto
              di linee pulite, volumi, proporzioni e dettagli inattesi: elementi capaci di
              trasformare una borsa in qualcosa che resta impresso, ancora prima di essere
              riconosciuto.
            </p>
            <p>
              Per noi il design non è soltanto estetica. È il modo in cui un oggetto accompagna
              chi lo indossa, il ricordo che lascia dopo essere stato visto, la sensazione di
              possedere qualcosa di autentico.
            </p>
            <p>
              Ogni pezzo è pensato per essere vissuto nel tempo, conservando il valore della
              manifattura italiana e di un'identità precisa, silenziosa e riconoscibile.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
