import ContentAnalyse from "@/app/components/content/analyse";
import ContentFormations from "@/app/components/content/formations";
import ContentPresentation from "@/app/components/content/presentation";
import ContentSoins from "@/app/components/content/soins";
import InkedModal from "@/app/components/inked-modal/inked-modal";

import './page.scss';

export default function Page() {
  return (
    <div className="next page-grid-parent">
      <div className="page-grid-element presentation">
        <InkedModal buttonText="Qui suis-je ?" title="Présentation personnelle ">
          <ContentPresentation />
        </InkedModal>
      </div>

      <div className="page-grid-element soins">
        <InkedModal buttonText="Soins à la personne" title="Accompagnement et soins dédiés à la santé mentale et au bien-être">
          <ContentSoins />
        </InkedModal>
      </div>

      <div className="page-grid-element formations">
        <InkedModal buttonText="Formations" title="Formations pour une meilleure compréhension des particularités mentales des enfants">
          <ContentFormations />
        </InkedModal>
      </div>

      <div className="page-grid-element analyse">
        <InkedModal buttonText="Analyse pratique pro" title="Analyses de pratiques professionnelles en milieu de la petite enfance et de l’enfance, dans un contexte d’inclusion">
          <ContentAnalyse />
        </InkedModal>
      </div>
    </div>
  );
}
