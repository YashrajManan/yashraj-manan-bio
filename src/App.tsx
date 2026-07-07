import './App.css'
import Background from './Background'

function App() {
  return (
    <>
      <Background />
      <main className="resume">
        <header className="resume-header">
          <div className="header-text">
            <h1>Yashraj</h1>
            <p className="subtitle">M.Sc. Biotechnology &nbsp;|&nbsp; Computational Biology &amp; AI</p>
            <p className="contact">
              New Delhi, India &nbsp;•&nbsp; +91 9958473180 &nbsp;•&nbsp;{' '}
              <a href="mailto:Yashraj90009@gmail.com">Yashraj90009@gmail.com</a> &nbsp;•&nbsp;{' '}
              <a href="https://linkedin.com/in/yashraj-manan-072976189" target="_blank" rel="noreferrer">
                linkedin.com/in/yashraj-manan-072976189
              </a>
            </p>
          </div>
          <img className="avatar" src="/profile.jpg" alt="Yashraj" />
        </header>

      <section className="resume-section">
        <h2>Research Interests</h2>
        <p>
          My research interests lie at the intersection of computational biology, evolutionary genomics, and
          bioinformatics. I am particularly fascinated by how biological sequences — genomes, proteins, and
          functional elements — evolve across deep evolutionary time, and what these changes reveal about
          fundamental principles of life. I am drawn to large-scale comparative genomics approaches that uncover
          the forces shaping genome architecture and biological diversity. More broadly, I am excited by the
          application of machine learning and AI to evolutionary biology — particularly how computational models
          can reveal patterns in genomic data that traditional methods cannot. I aim to work at the interface of
          bioinformatics, evolutionary biology, and data-driven biology, contributing to questions that span
          multiple domains of life.
        </p>
      </section>

      <section className="resume-section">
        <h2>Education</h2>
        <div className="entry">
          <div className="entry-head">
            <h3>M.Sc. Biotechnology — South Asian University, New Delhi</h3>
            <span className="entry-date">2024–2026</span>
          </div>
          <p>CGPA: 8.78/10</p>
        </div>
        <div className="entry">
          <div className="entry-head">
            <h3>B.Sc. (Hons) Microbiology — GD Goenka University, Gurugram</h3>
          </div>
          <p>CGPA: 8.95/10</p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Research Experience</h2>

        <div className="entry">
          <div className="entry-head">
            <h3>Master's Thesis: Computational and Experimental Approaches to Study HIV-1 Subtypes B and C Biology</h3>
            <span className="entry-date">2021–2024</span>
          </div>
          <ul>
            <li>
              Developed and benchmarked deep learning classifiers with varied encoding strategies for HIV-1
              subtype identification using POL gene sequences, comparing against classical ML approaches.
            </li>
            <li>
              Applied Transformer models with Protein Language Model (ESM2) embeddings to forecast viral
              evolutionary trajectories and amino acid substitutions in HIV-1 subtype B Gag Protein.
            </li>
            <li>Validated LDHA protein expression in HIV-1 subtypes B and C via western blotting (wet lab validation).</li>
          </ul>
        </div>

        <div className="entry">
          <div className="entry-head">
            <h3>Bachelor's Major Project: Chalcone-Based Derivatives as Antimicrobial Agents — In-silico Design &amp; ADMET Studies</h3>
          </div>
          <ul>
            <li>
              Performed in-silico design, ADMET profiling, and molecular docking of chalcone derivatives against
              antimicrobial targets.
            </li>
          </ul>
        </div>
      </section>

      <section className="resume-section">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          <div>
            <h3>Dry Lab</h3>
            <ul>
              <li>Python: Pandas, NumPy, Scikit-learn, TensorFlow, PyTorch, Matplotlib, Seaborn</li>
              <li>R: dplyr, ggplot2, Bioconductor</li>
              <li>Linux-based research environments</li>
              <li>BLAST, FASTA, Clustal Omega, MEGA11</li>
              <li>SWISS-MODEL, AlphaFold, STRING, Cytoscape</li>
              <li>AutoDock 4.2.6, AutoDock Vina, GROMACS, SWISS-ADME, CastP</li>
            </ul>
          </div>
          <div>
            <h3>Wet Lab</h3>
            <ul>
              <li>SDS-PAGE &amp; Western Blotting</li>
              <li>PCR, RT-PCR</li>
              <li>DNA, RNA, Plasmid &amp; Protein extraction</li>
              <li>Mammalian &amp; Bacterial cell culture</li>
              <li>Competent cell prep, transformation &amp; cloning</li>
              <li>Protein estimation (Bradford &amp; BCA), Spectrophotometry</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="resume-section">
        <h2>Conferences, Workshops &amp; Training</h2>
        <div className="skills-grid">
          <div>
            <h3>Conferences</h3>
            <ul>
              <li>Oral — TLASH 2024, GD Goenka University</li>
              <li>Poster — BBIFCC INTERONC 2025, SAU New Delhi</li>
              <li>Volunteer — South Asian Biotechnology Conference 2025, SAU</li>
            </ul>
          </div>
          <div>
            <h3>Training &amp; Workshops</h3>
            <ul>
              <li>Research Methodology — IIT Kharagpur (ATDC)</li>
              <li>Bioinformatics Internship — Rapture Biotech, Noida (1 month, 2023)</li>
              <li>Genome Informatics 6th Ed. &amp; Genomes, Networks &amp; Pathways 5th Ed. (International)</li>
              <li>CRISPR/Cas9 &amp; AI/ML for Neurodegenerative Disorders — SAU</li>
              <li>BIF-DD-2026: AI &amp; ML Methods in Bioinformatics &amp; Drug Design</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="resume-section">
        <h2>Languages</h2>
        <p>English (Written &amp; Spoken) • Hindi (Written &amp; Spoken) • German (Written &amp; Spoken, ein bisschen) • Punjabi (Written &amp; Spoken) • Urdu (Spoken)</p>
        </section>
      </main>
    </>
  )
}

export default App
