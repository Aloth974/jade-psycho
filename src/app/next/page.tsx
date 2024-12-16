import InkedModal from "../components/inked-modal/inked-modal";

import './page.scss';

export default function Page() {
  return (
    <div className="page-grid-parent">
      <div className="page-grid-element soins">
        <InkedModal buttonClassName="turquoise" buttonText="Soins à la personne">
          <h2>Soins à la personne</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad modi repellendus, optio eveniet eligendi molestiae?
            Fugiat, temporibus! A rerum pariatur neque laborum earum, illum voluptatibus eum voluptatem fugiat, porro animi
            tempora? Sit harum nulla, nesciunt molestias, iusto aliquam aperiam est qui possimus reprehenderit ipsam ea aut.
          </p>
        </InkedModal>
      </div>

      <div className="page-grid-element formations">
        <InkedModal buttonClassName="yellow" buttonText="Formations">
          <h2>Formations</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad modi repellendus, optio eveniet eligendi molestiae?
            Fugiat, temporibus! A rerum pariatur neque laborum earum, illum voluptatibus eum voluptatem fugiat, porro animi
            tempora? Sit harum nulla, nesciunt molestias, iusto aliquam aperiam est qui possimus reprehenderit ipsam ea aut.
          </p>
        </InkedModal>
      </div>

      <div className="page-grid-element analyse">
        <InkedModal buttonClassName="lavender" buttonText="Analyse pratique pro">
          <h2>Analyse pratique pro</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad modi repellendus, optio eveniet eligendi molestiae?
            Fugiat, temporibus! A rerum pariatur neque laborum earum, illum voluptatibus eum voluptatem fugiat, porro animi
            tempora? Sit harum nulla, nesciunt molestias, iusto aliquam aperiam est qui possimus reprehenderit ipsam ea aut
            vero! Eius, dignissimos esse eligendi veniam.
          </p>
        </InkedModal>
      </div>
    </div>
  );
}
