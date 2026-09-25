import { Button, Descriptions, Progress, Table, Tag, type TableColumnsType } from "antd";
import { LuCreditCard, LuDownload } from "react-icons/lu";
import { SettingRow, SettingsCard, SettingsSection } from "../../components/settings/SettingsBlocks";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { useToast } from "../../hooks/useToast";
import { Can } from "../../rbac/Can";
import { palette } from "../../theme/palette";

type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Failed";
};

const invoices: Invoice[] = [
  { id: "inv-0926", date: "Sep 12, 2026", description: "Team plan · 10 seats", amount: "$80.00", status: "Paid" },
  { id: "inv-0826", date: "Aug 12, 2026", description: "Team plan · 10 seats", amount: "$80.00", status: "Paid" },
  { id: "inv-0726", date: "Jul 12, 2026", description: "Team plan · 8 seats", amount: "$64.00", status: "Failed" },
  { id: "inv-0626", date: "Jun 12, 2026", description: "Team plan · 8 seats", amount: "$64.00", status: "Paid" },
];

export function BillingPage() {
  const toast = useToast();

  const columns: TableColumnsType<Invoice> = [
    { title: "Date", dataIndex: "date", width: "9rem", render: (date) => <span className="tabular-nums">{date}</span> },
    { title: "Description", dataIndex: "description", render: (text) => <span className="text-muted">{text}</span> },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "7rem",
      render: (amount) => <span className="tabular-nums">{amount}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "7rem",
      render: (status: Invoice["status"]) => (
        <Tag
          className={`m-0 text-2xs ${
            status === "Paid" ? "border-line bg-app text-muted" : "border-danger-line bg-danger-soft text-danger-text"
          }`}
        >
          {status}
        </Tag>
      ),
    },
    {
      key: "download",
      width: "3rem",
      render: (_, invoice) => (
        <Button
          type="text"
          size="small"
          icon={<LuDownload />}
          aria-label={`Download invoice ${invoice.id}`}
          onClick={() => toast.success("Invoice downloaded", `${invoice.id}.pdf`)}
          className="text-muted"
        />
      ),
    },
  ];

  const manageButton = (label: string, onClick: () => void) => (
    <Can permission="billing.manage" mode="disable">
      {(allowed) => (
        <Button disabled={!allowed} onClick={onClick}>
          {label}
        </Button>
      )}
    </Can>
  );

  return (
    <SettingsPage title="Plan & billing" description="Your plan, seats, payment method and invoices.">
      <SettingsSection title="Plan">
        <SettingsCard footer="Viewers and guests don't use a paid seat.">
          <div className="flex items-start justify-between gap-6 px-5 py-4">
            <div>
              <div className="flex items-center gap-2 text-ui font-medium">
                Team plan <Tag className="m-0 border-0 bg-brand-soft text-2xs text-brand">Current</Tag>
              </div>
              <div className="mt-0.5 text-ui text-muted">$8 per paid seat / month · Renews Oct 12, 2026</div>
            </div>
            <div className="flex gap-2">
              {manageButton("Change seats", () => toast.success("Seats updated", "You now have 12 seats."))}
              {manageButton("Change plan", () =>
                toast.info("Business plan", "Our team will reach out within one business day."),
              )}
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="mb-2 flex items-center justify-between text-ui">
              <span>Paid seats</span>
              <span className="text-muted tabular-nums">5 of 10 used</span>
            </div>
            <Progress percent={50} showInfo={false} size="small" strokeColor={palette.ink} railColor={palette.line} />
            <Descriptions
              column={3}
              size="small"
              className="mt-4"
              items={[
                { key: "free", label: "Free seats", children: "2 (viewers, guests)" },
                { key: "next", label: "Next invoice", children: "$80.00" },
                { key: "date", label: "Billing date", children: "Oct 12, 2026" },
              ]}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Payment method">
        <SettingsCard>
          <SettingRow label="Visa ending in 4242" description="Expires 08/28 · billing@platform.dev">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-md border border-line bg-app text-muted">
                <LuCreditCard className="size-4" />
              </span>
              {manageButton("Update", () =>
                toast.success("Payment method updated", "Visa ending in 4242 is now your default."),
              )}
            </div>
          </SettingRow>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Invoices">
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <Table<Invoice>
            rowKey="id"
            size="middle"
            columns={columns}
            dataSource={invoices}
            pagination={false}
            classNames={{
              header: { cell: "h-10! border-b border-line text-ui font-medium whitespace-nowrap text-muted" },
              body: { cell: "text-ui text-ink" },
            }}
            className="[&_.ant-table-tbody>tr:last-child>td]:border-b-0"
          />
        </div>
      </SettingsSection>
    </SettingsPage>
  );
}
