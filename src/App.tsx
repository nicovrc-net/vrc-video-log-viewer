import React, { useEffect, useState } from "react";
import { Container, Typography, Switch, FormControlLabel, List, ListItem, ListItemText } from "@mui/material";

type Log = { filePath: string; text: string };

export default function App() {
  const [config, setConfig] = useState<any>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filters, setFilters] = useState({ Video: true, Image: true, String: true });

  useEffect(() => {
    window.api.loadConfig().then((cfg) => setConfig(cfg));
  }, []);

  useEffect(() => {
    if (!config?.logfolder) return;
    window.api.watchLogs(config.logfolder, filters);
    window.api.onNewLogs((newLog: Log) => setLogs((prev) => [...prev, newLog]));
  }, [config?.logfolder, filters]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>VRC Video Log Viewer</Typography>
      {config?.error && <Typography color="error">{config.error}</Typography>}
      <Typography>ログフォルダ: {config?.logfolder || "(未設定)"}</Typography>
      <div>
        {Object.keys(filters).map((key) => (
          <FormControlLabel
            key={key}
            control={
              <Switch
                checked={filters[key as keyof typeof filters]}
                onChange={() =>
                  setFilters({ ...filters, [key]: !filters[key as keyof typeof filters] })
                }
              />
            }
            label={key}
          />
        ))}
      </div>
      <List>
        {logs.map((log, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={log.filePath} secondary={log.text} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
