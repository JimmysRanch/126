export default function GroomerPerformance() {
  return (
    <>
      <style>{`
        :root{
          --bg0:#070b12;
          --bg1:#0a1020;
          --glass: rgba(20, 28, 48, .55);
          --stroke: rgba(255,255,255,.10);
          --stroke2: rgba(255,255,255,.06);
          --text: rgba(255,255,255,.92);
          --muted: rgba(255,255,255,.68);
          --muted2: rgba(255,255,255,.45);
          --blue: #4fd1ff;
          --amber:#ffb44d;
          --green:#74ff9e;
        }

        *{box-sizing:border-box}

        body{
          margin:0;
          background:#070b12;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .page{
          min-height:100vh;
          display:grid;
          place-items:center;
          padding:28px;
          background:
            radial-gradient(1200px 700px at 50% 10%, rgba(94,120,255,.15), transparent 55%),
            radial-gradient(1000px 600px at 10% 60%, rgba(79,209,255,.10), transparent 55%),
            radial-gradient(900px 600px at 90% 65%, rgba(255,180,77,.10), transparent 55%),
            linear-gradient(180deg, var(--bg0), var(--bg1));
          color:var(--text);
        }

        .stage{
          width:min(1400px,100%);
          display:grid;
          gap:18px;
        }

        .kpis{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:18px;
        }

        .kpi{
          position:relative;
          padding:10px;
          border-radius:18px;
          background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));
          box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.07) inset;
          overflow:hidden;
        }

        .kpi::before{
          content:"";
          position:absolute;
          inset:-2px;
          border-radius:20px;
          background:radial-gradient(520px 160px at 20% 30%, rgba(79,209,255,.28), transparent 62%);
          pointer-events:none;
        }

        .kpi.amber::before{
          background:radial-gradient(520px 160px at 20% 30%, rgba(255,180,77,.28), transparent 62%);
        }

        .kpi.green::before{
          background:radial-gradient(520px 160px at 20% 30%, rgba(116,255,158,.24), transparent 62%);
        }

        .kpiInner{
          border-radius:14px;
          background:rgba(10,14,26,.55);
          border:1px solid rgba(255,255,255,.08);
          padding:16px 18px;
        }

        .kpiTop{
          display:flex;
          align-items:center;
          gap:14px;
        }

        .icon{
          width:38px;
          height:38px;
          border-radius:12px;
          display:grid;
          place-items:center;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.10);
        }

        .value{
          font-size:44px;
          font-weight:700;
          display:flex;
          align-items:baseline;
          gap:8px;
        }

        .unit{
          font-size:18px;
          opacity:.75;
        }

        .label{
          margin-top:6px;
          font-size:13px;
          letter-spacing:1.4px;
          text-transform:uppercase;
          opacity:.75;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:18px;
        }

        .card{
          position:relative;
          padding:10px;
          border-radius:18px;
          background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02));
          box-shadow:0 26px 70px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.07) inset;
          overflow:hidden;
        }

        .card::before{
          content:"";
          position:absolute;
          inset:-2px;
          border-radius:20px;
          background:radial-gradient(520px 220px at 20% 20%, rgba(79,209,255,.16), transparent 62%);
        }

        .card.amber::before{
          background:radial-gradient(520px 220px at 20% 20%, rgba(255,180,77,.16), transparent 62%);
        }

        .cardHeader{
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px 8px;
          font-size:14px;
        }

        .dot{
          width:10px;
          height:10px;
          border-radius:3px;
          background:var(--blue);
        }

        .card.amber .dot{
          background:var(--amber);
        }

        .cardBody{
          background:rgba(10,14,26,.52);
          border:1px solid rgba(255,255,255,.08);
          border-radius:14px;
          padding:14px;
        }

        .row{
          display:flex;
          justify-content:space-between;
          padding:10px;
          border-radius:12px;
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.06);
          margin-bottom:10px;
        }

        @media(max-width:1100px){
          .kpis,.grid{grid-template-columns:1fr}
        }
      `}</style>

      <div className="page">
        <div className="stage">

          <div className="kpis">
            <div className="kpi">
              <div className="kpiInner">
                <div className="kpiTop">
                  <div className="icon">⏱</div>
                  <div className="value">64<span className="unit">mins</span></div>
                </div>
                <div className="label">AVG MINUTES / APPOINTMENT</div>
              </div>
            </div>

            <div className="kpi amber">
              <div className="kpiInner">
                <div className="kpiTop">
                  <div className="icon">$</div>
                  <div className="value">$3.75</div>
                </div>
                <div className="label">REVENUE PER MIN | RPM</div>
              </div>
            </div>

            <div className="kpi green">
              <div className="kpiInner">
                <div className="kpiTop">
                  <div className="icon">🐾</div>
                  <div className="value">75</div>
                </div>
                <div className="label">COMPLETED APPOINTMENTS</div>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <div className="cardHeader"><div className="dot"/>RPM (Monthly)</div>
              <div className="cardBody">Chart placeholder</div>
            </div>

            <div className="card">
              <div className="cardHeader"><div className="dot"/>Average Minutes per Appointment</div>
              <div className="cardBody">Chart placeholder</div>
            </div>

            <div className="card amber">
              <div className="cardHeader"><div className="dot"/>RPM by Dog Size</div>
              <div className="cardBody">Chart placeholder</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
