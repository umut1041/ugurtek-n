import React, { useState } from "react";
import data from "../data/exercises/writing-templates.json";

type Template = (typeof data.templates)[number];

const WritingTemplateViewer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(
    data.templates[0]?.id ?? ""
  );

  const selected: Template | undefined = data.templates.find(
    (t) => t.id === selectedId
  );

  return (
    <div className="writing-template-viewer">
      <label>
        Görev türü:
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {data.templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.context}
            </option>
          ))}
        </select>
      </label>

      {selected && (
        <div className="writing-template">
          <p className="template-line">
            <strong>Selamlama:</strong> {selected.salutation}
          </p>
          {selected.body.map((line, idx) => (
            <p key={idx} className="template-line">
              {line}
            </p>
          ))}
          <p className="template-line">
            <strong>Kapanış:</strong> {selected.closing}
          </p>
        </div>
      )}
    </div>
  );
};

export default WritingTemplateViewer;

