'use client';

import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Undo2, Redo2 } from 'lucide-react';

interface RichTextEditorProps {
  valor: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

interface BotaoProps {
  titulo: string;
  ativo?: boolean;
  desativado?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Botao({ titulo, ativo = false, desativado = false, onClick, children }: BotaoProps): React.ReactElement {
  return (
    <button
      type="button"
      className={ativo ? 'article-editor-btn article-editor-btn--on' : 'article-editor-btn'}
      title={titulo}
      aria-label={titulo}
      aria-pressed={ativo}
      disabled={desativado}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ valor, onChange, disabled = false }: RichTextEditorProps): React.ReactElement {
  const [linkAberto, setLinkAberto] = useState(false);
  const [url, setUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    content: valor,
    extensions: [
      // Only what the backend filter keeps: h2/h3, bold, italic, lists, quote, links, line break
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        horizontalRule: false,
        underline: false,
        link: { openOnClick: false, autolink: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
    ],
    onUpdate: ({ editor: atual }) => onChange(atual.isEmpty ? '' : atual.getHTML()),
    editorProps: {
      attributes: { class: 'article-editor-content article-body', 'aria-label': 'Texto do artigo' },
    },
  });

  // Tiptap 3 does not re-render on selection changes by default: subscribe the toolbar to the state it shows
  const estado = useEditorState({
    editor,
    selector: ({ editor: atual }) => ({
      h2: atual?.isActive('heading', { level: 2 }) ?? false,
      h3: atual?.isActive('heading', { level: 3 }) ?? false,
      negrito: atual?.isActive('bold') ?? false,
      italico: atual?.isActive('italic') ?? false,
      lista: atual?.isActive('bulletList') ?? false,
      listaNumerada: atual?.isActive('orderedList') ?? false,
      citacao: atual?.isActive('blockquote') ?? false,
      link: atual?.isActive('link') ?? false,
      podeDesfazer: atual?.can().undo() ?? false,
      podeRefazer: atual?.can().redo() ?? false,
    }),
  });

  useEffect(() => {
    // emitUpdate=false: a plain editable toggle must not fire onUpdate (it would mark the form as dirty)
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);

  if (!editor || !estado) return <div className="article-editor article-editor--loading">Carregando editor...</div>;

  function abrirLink(): void {
    setUrl(editor?.getAttributes('link').href || '');
    setLinkAberto(true);
  }

  function aplicarLink(): void {
    const alvo = url.trim();
    if (!alvo) {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const href = /^(https?:\/\/|mailto:)/i.test(alvo) ? alvo : `https://${alvo}`;
      editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setLinkAberto(false);
  }

  return (
    <div className="article-editor">
      <div className="article-editor-toolbar" role="toolbar" aria-label="Formatação do texto">
        <Botao titulo="Título" ativo={estado.h2} desativado={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={17} />
        </Botao>
        <Botao titulo="Subtítulo" ativo={estado.h3} desativado={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={17} />
        </Botao>
        <Botao titulo="Negrito" ativo={estado.negrito} desativado={disabled} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={17} />
        </Botao>
        <Botao titulo="Itálico" ativo={estado.italico} desativado={disabled} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={17} />
        </Botao>
        <Botao titulo="Lista" ativo={estado.lista} desativado={disabled} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={17} />
        </Botao>
        <Botao titulo="Lista numerada" ativo={estado.listaNumerada} desativado={disabled} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={17} />
        </Botao>
        <Botao titulo="Citação" ativo={estado.citacao} desativado={disabled} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={17} />
        </Botao>
        <Botao titulo="Link" ativo={estado.link} desativado={disabled} onClick={abrirLink}>
          <LinkIcon size={17} />
        </Botao>
        <span className="article-editor-sep" aria-hidden="true" />
        <Botao titulo="Desfazer" desativado={disabled || !estado.podeDesfazer} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={17} />
        </Botao>
        <Botao titulo="Refazer" desativado={disabled || !estado.podeRefazer} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={17} />
        </Botao>
      </div>

      {linkAberto && (
        <div className="article-editor-link">
          <input
            type="text"
            value={url}
            placeholder="Endereço do link (ex.: https://exemplo.com). Deixe vazio para remover."
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                aplicarLink();
              }
            }}
            aria-label="Endereço do link"
            autoFocus
          />
          <button type="button" className="article-editor-btn article-editor-btn--text" onClick={aplicarLink}>Aplicar</button>
          <button type="button" className="article-editor-btn article-editor-btn--text" onClick={() => setLinkAberto(false)}>Cancelar</button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
