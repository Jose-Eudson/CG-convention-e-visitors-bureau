import { useTranslation } from "react-i18next";

const Board = () => {
  const { t } = useTranslation("board");

  const boardMembers = [
    { name: "Nome Completo", role: t("roles.president"), photo: "" },
    { name: "Nome Completo", role: t("roles.vicePresident"), photo: "" },
    { name: "Nome Completo", role: t("roles.captureDirector"), photo: "" },
    { name: "Nome Completo", role: t("roles.financeDirector"), photo: "" },
    { name: "Nome Completo", role: t("roles.marketingDirector"), photo: "" },
    { name: "Nome Completo", role: t("roles.eventsDirector"), photo: "" }
  ];

  return (
    <section className="bg-neutral-800 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-3xl font-bold text-emerald-400">
          {t("title")}
        </h2>

        <p className="mb-12 text-neutral-400">{t("subtitle")}</p>

        <div className="grid gap-8 md:grid-cols-3">
          {boardMembers.map((member, index) => (
            <div
              key={index}
              className="rounded-xl border border-emerald-500/40 bg-neutral-900 p-6 text-center"
            >
              <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-500">
                [Foto]
              </div>

              <h3 className="mb-1 text-lg font-semibold text-white">
                {member.name}
              </h3>

              <p className="text-sm text-emerald-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Board;
