export default function KeyIndicatorsSection() {
  return (
    <section className="flex items-center justify-between my-5 mx-2 gap-3 py-4 px-5 rounded-lg">
      <div className="flex flex-col items-start justify-between w-62 h-62 gap-2 p-4 bg-surface-container-lowest rounded-lg border-t-8 border-primary">
        <div>
          <p>Key Indicator 1</p>
          <p>numero</p>
          <div>icone</div>
        </div>
        <div>
          <p>dados</p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between w-62 h-62 gap-2 p-4 bg-surface-container-lowest rounded-lg border-t-8 border-status-present">
        <div>
          <p>Presença Geral (Mês)</p>
          <p>numero</p>

          <div>icone</div>
        </div>
        <div>
          <p>dados</p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between w-62 h-62 gap-2 p-4 bg-surface-container-lowest rounded-lg border-t-8 border-secondary-hover">
        <div>
          <p>Key Indicator 3</p>
          <p>numero</p>
          <div>icone</div>
        </div>
        <div>
          <p>dados</p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between w-62 h-62 gap-2 p-4 bg-surface-container-lowest rounded-lg border-t-8 border-secondary">
        <div>
          <p>Key Indicator 4</p>
          <p>numero</p>
          <div>icone</div>
        </div>
        <div>
          <p>dados</p>
        </div>
      </div>
    </section>
  );
}
