import InkedModal from "../components/inked-modal/inked-modal";

export default function Page() {
  return (
    <div className="m-4 grid grid-cols-3 grid-rows-3" style={{ height: "calc(100vh - 20%)" }}>
      <div className="row-start-1 row-end-1 col-start-1 col-start-1 self-center">
        <InkedModal buttonClassName="turquoise" buttonText="Soins à la personne">
          <h2>Soins à la personne</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad modi repellendus, optio eveniet eligendi molestiae?
            Fugiat, temporibus! A rerum pariatur neque laborum earum, illum voluptatibus eum voluptatem fugiat, porro animi
            tempora? Sit harum nulla, nesciunt molestias, iusto aliquam aperiam est qui possimus reprehenderit ipsam ea aut.
          </p>
        </InkedModal>
      </div>

      <div className="row-start-2 row-end-2 col-start-3 col-start-3 self-center">
        <InkedModal buttonClassName="yellow" buttonText="Formations">
          <h2>Formations</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad modi repellendus, optio eveniet eligendi molestiae?
            Fugiat, temporibus! A rerum pariatur neque laborum earum, illum voluptatibus eum voluptatem fugiat, porro animi
            tempora? Sit harum nulla, nesciunt molestias, iusto aliquam aperiam est qui possimus reprehenderit ipsam ea aut.
          </p>
        </InkedModal>
      </div>

      <div className="row-start-3 row-end-3 col-start-2 col-start-2 self-center">
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
