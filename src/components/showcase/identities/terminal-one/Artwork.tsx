import "./identity.css";

export default function TerminalArtwork() {
  return (
    <div className="case-motif case-motif--terminal" aria-hidden="true">
      <p className="case-motif__tape">SPY +0.42 · QQQ -0.18 · NVDA +1.08</p>
      <p className="case-motif__readout">RANK / 87.4</p>
      <ol className="case-motif__reels">
        <li>CALL</li>
        <li>30Δ</li>
        <li>45D</li>
      </ol>
    </div>
  );
}
