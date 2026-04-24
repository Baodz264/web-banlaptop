import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, message } from "antd";

import ShipmentService from "../../../services/shipment.service";
import ShipmentProofService from "../../../services/shipmentProof.service";

import ShipmentInfo from "../../../components/admin/orders/ShipmentInfo";
import ShipmentProof from "../../../components/admin/orders/ShipmentProof";

const Shipment = () => {
  const { id } = useParams();

  const [shipment, setShipment] = useState(null);
  const [proofs, setProofs] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const shipRes = await ShipmentService.getShipments({
        order_id: id,
      });

      const shipmentData = shipRes?.data?.data?.items?.[0] || null;
      setShipment(shipmentData);

      if (shipmentData) {
        const proofRes = await ShipmentProofService.getShipmentProofs({
          shipment_id: shipmentData.id,
        });

        const proofData = proofRes?.data?.data?.items || [];
        setProofs(proofData);
      }
    } catch (error) {
      console.error(error);
      message.error("Không tải được thông tin vận chuyển");
    }
  }, [id]); 

  useEffect(() => {
    loadData();
  }, [loadData]); 

  return (
    <div>
      <Card title="Shipment">
        <ShipmentInfo shipment={shipment} />
      </Card>
      
      <div style={{ marginTop: 24 }}>
        <ShipmentProof proofs={proofs} />
      </div>
    </div>
  );
};

export default Shipment;