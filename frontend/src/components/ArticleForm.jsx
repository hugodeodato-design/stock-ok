import React from 'react';

export default function ArticleForm({ onAdd, onUpdate, editingArticle, onCancel }) {
  const emptyForm = {
    client: '',
    reference: '',
    designation: '',
    dateEntree: '',
    dateSortie: '',
    emplacement: '',
    quantite: 1,
    autresInfos: ''
  };

  const [form, setForm] = React.useState(() => editingArticle || emptyForm);

  React.useEffect(() => {
    setForm(editingArticle || emptyForm);
  }, [editingArticle]);

  const submit = () => {
    if (!form.client || !form.reference || !form.designation) {
      alert('Champs obligatoires');
      return;
    }

    if (editingArticle) {
      onUpdate(editingArticle.id, form);
    } else {
      onAdd(form);
    }

    setForm(emptyForm);
  };

  return (
    <div className="card">
      <h3>{editingArticle ? "Modifier l'article" : 'Ajouter un article'}</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8
        }}
      >
        <input
          className="input"
          placeholder="Client"
          value={form.client}
          onChange={(e) => setForm({ ...form, client: e.target.value })}
        />

        <input
          className="input"
          placeholder="Référence"
          value={form.reference}
          onChange={(e) => setForm({ ...form, reference: e.target.value })}
        />

        <input
          className="input"
          placeholder="Désignation"
          style={{ gridColumn: '1 / -1' }}
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
        />

        <input
          className="input"
          type="date"
          value={form.dateEntree}
          onChange={(e) => setForm({ ...form, dateEntree: e.target.value })}
        />

        <input
          className="input"
          type="date"
          value={form.dateSortie}
          onChange={(e) => setForm({ ...form, dateSortie: e.target.value })}
        />

        <input
          className="input"
          placeholder="Emplacement"
          value={form.emplacement}
          onChange={(e) => setForm({ ...form, emplacement: e.target.value })}
        />

        <input
          className="input"
          type="number"
          placeholder="Quantité"
          value={form.quantite}
          onChange={(e) => setForm({ ...form, quantite: Number(e.target.value) })}
        />

        <input
          className="input"
          placeholder="Autres infos"
          style={{ gridColumn: '1 / -1' }}
          value={form.autresInfos}
          onChange={(e) => setForm({ ...form, autresInfos: e.target.value })}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <button className="btn btn-primary" onClick={submit}>
          {editingArticle ? 'Modifier' : 'Ajouter'}
        </button>
        <button className="btn" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
}
