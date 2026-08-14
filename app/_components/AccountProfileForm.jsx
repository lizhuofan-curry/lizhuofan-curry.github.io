"use client";

import { useState } from "react";
import { SpinnerGap } from "@phosphor-icons/react";
import { authClient } from "../../lib/auth-client";

export function AccountProfileForm({ initialName }) {
  const [name, setName] = useState(initialName || "");
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setSaving(true); setMessage(null);
    const { error } = await authClient.updateUser({ name: name.trim() });
    setSaving(false);
    setMessage(error ? { kind: "error", text: "暂时无法保存显示名称。" } : { kind: "success", text: "显示名称已保存。" });
  }
  return <form className="account-editor" onSubmit={submit}><label><span>显示名称</span><input value={name} onChange={(event) => setName(event.target.value)} minLength={1} maxLength={80} required /></label><button className="secondary-button" type="submit" disabled={saving}>{saving && <SpinnerGap className="spin" size={18} />}保存名称</button>{message && <p className={`identity-message ${message.kind}`} role="status">{message.text}</p>}</form>;
}
