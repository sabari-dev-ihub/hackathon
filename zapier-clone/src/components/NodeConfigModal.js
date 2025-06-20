import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const NodeConfigModal = ({ show, onClose, node, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (node?.data?.config) {
      setFormData(node.data.config);
    } else {
      setFormData({});
    }
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (node) {
      onSave(node.id, formData);
    }
    onClose();
  };

  const renderFields = () => {
    if (!node) return null;

    switch (node.data.type) {
      case "trigger":
        return (
          <Form.Group>
            <Form.Label>Trigger Type</Form.Label>
            <Form.Control
              name="triggerType"
              value={formData.triggerType || ""}
              onChange={handleChange}
              placeholder="e.g., formSubmission"
            />
          </Form.Group>
        );

      case "action":
        return (
          <>
            <Form.Group>
              <Form.Label>Action Type</Form.Label>
              <Form.Control
                name="actionType"
                value={formData.actionType || ""}
                onChange={handleChange}
                placeholder="e.g., sendEmail"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email (if applicable)</Form.Label>
              <Form.Control
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="e.g., user@example.com"
              />
            </Form.Group>
          </>
        );

      case "condition":
        return (
          <Form.Group>
            <Form.Label>Condition Expression</Form.Label>
            <Form.Control
              name="expression"
              value={formData.expression || ""}
              onChange={handleChange}
              placeholder="e.g., marks < 40"
            />
          </Form.Group>
        );

      case "delay":
        return (
          <Form.Group>
            <Form.Label>Delay Duration</Form.Label>
            <Form.Control
              name="duration"
              value={formData.duration || ""}
              onChange={handleChange}
              placeholder="e.g., 1h, 2d"
            />
          </Form.Group>
        );

      default:
        return <p>No settings required for this node type.</p>;
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Configure {node?.data?.label}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>{renderFields()}</Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Settings
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NodeConfigModal;
