import { Clue, ForensicTrace } from '../types';

export const getClueForensicTraces = (clue: Clue): ForensicTrace[] => {
  if (clue.forensicTraces && clue.forensicTraces.length > 0) {
    return clue.forensicTraces;
  }

  // Generate customized authentic forensic traces based on itemType or clue properties
  const traces: ForensicTrace[] = [];

  switch (clue.itemType) {
    case 'coffee':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'คราบผงสารเคมีสีขาวไม่ละลายน้ำ',
          type: 'chemical',
          description: 'ละอองผลึกสีขาวละเอียดเกาะแน่นตามขอบปากแก้วด้านใน ไม่ละลายไปกับของเหลว ส่งกลิ่นอัลมอนด์ไหม้ฉุน',
          locationLabel: 'บริเวณขอบปากแก้วด้านใน',
          pinX: 52,
          pinY: 28,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'รอยประทับริมฝีปากและลายนิ้วมือแฝง',
          type: 'fingerprint',
          description: 'พบคราบไขมันเซลล์เยื่อบุผิวริมฝีปากและรอยพิมพ์ลายนิ้วมือแฝงบางส่วนที่ผิวด้านนอกของแก้ว',
          locationLabel: 'ผิวด้านนอกแก้วใกล้ก้านจับ',
          pinX: 38,
          pinY: 60,
        }
      );
      break;

    case 'cyanosis':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'ภาวะเขียวคล้ำจัด (Peripheral Cyanosis)',
          type: 'cyanosis',
          description: 'เนื้อเยื่อริมฝีปากและใต้เล็บเปลี่ยนเป็นสีม่วงคล้ำจัด บ่งชี้ว่าฮีโมโกลบินไม่สามารถส่งออกซิเจนให้เซลล์ได้',
          locationLabel: 'ริมฝีปากบนและล่าง',
          pinX: 48,
          pinY: 45,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'ละอองน้ำลายผสมเยื่อเมือก',
          type: 'droplet',
          description: 'มีคราบน้ำลายแห้งกรังเล็กน้อยที่มุมปาก ไม่มีรอยแผลแตกหรือฉีกขาดจากการถูกกระแทก',
          locationLabel: 'มุมปากขวา',
          pinX: 68,
          pinY: 52,
        }
      );
      break;

    case 'powder_foil':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'รอยฉีกขาดของปากซองฟอยล์',
          type: 'scratch',
          description: 'รอยฉีกด้วยมือแบบเร่งรีบ รอยขอบฉีกมีผงสีขาวตกค้างติดอยู่ในรอยพับฟอยล์',
          locationLabel: 'รอยฉีกมุมบนขวา',
          pinX: 62,
          pinY: 22,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'คราบผงเกลือไซยาไนด์เข้มข้น',
          type: 'chemical',
          description: 'ส่องพบเกล็ดผลึกสารกลุ่ม Cyanide Salt ความบริสุทธิ์สูงกว่า 98% ตกค้างที่ก้นซอง',
          locationLabel: 'ก้นซองฟอยล์ด้านใน',
          pinX: 45,
          pinY: 72,
        }
      );
      break;

    case 'knife':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'คราบเลือดแห้งกรังและฟิล์มเลือด (Blood Clot)',
          type: 'blood',
          description: 'คราบเลือดแห้งติดแน่นบนใบมีดลึกเข้าไป 8.5 ซม. สอดคล้องกับความลึกของบาดแผลที่ช่องอก',
          locationLabel: 'ใบมีดคมเดี่ยวช่วงกลางถึงปลาย',
          pinX: 58,
          pinY: 35,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'รอยบิ่นระดับจุลภาค (Micro-nicking)',
          type: 'scratch',
          description: 'คมมีดมีรอยบิ่นขนาด 0.3 มม. เกิดจากการเสียดสีกับกระดูกซี่โครงขณะถูกแทงแทรกผ่าน',
          locationLabel: 'คมมีดส่วนปลาย 2 ซม.',
          pinX: 74,
          pinY: 20,
        },
        {
          id: `${clue.id}-tr3`,
          name: 'รอยนิ้วมือเปื้อนเลือดบนด้ามจับ',
          type: 'fingerprint',
          description: 'ตรวจพบลายนิ้วมือแฝงชนิดเลือด (Patent Bloody Fingerprint) ที่ด้ามจับพลาสติก',
          locationLabel: 'ด้ามจับมีด',
          pinX: 25,
          pinY: 75,
        }
      );
      break;

    case 'wound':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'ขอบแผลเรียบกริบ (Clean-cut Margins)',
          type: 'blood',
          description: 'บาดแผลถูกแทงขอบแผลเรียบ ไม่มีรอยช้ำหรือฉีกกระชาก บ่งบอกว่าเกิดจากอาวุธมีคมมาก',
          locationLabel: 'ขอบปากแผลด้านบน',
          pinX: 50,
          pinY: 42,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'มุมแผลด้านหนึ่งทู่ อีกด้านหนึ่งแหลม',
          type: 'scratch',
          description: 'มุมแผลทู่ด้านบนและแหลมด้านล่าง ยืนยันว่าใช้อาวุธมีดคมเดี่ยว (Single-edged Blade) กว้าง 2.5 ซม.',
          locationLabel: 'มุมปลายบาดแผล',
          pinX: 62,
          pinY: 60,
        }
      );
      break;

    case 'blood_spatter':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'หยดเลือดกระเด็นลักษณะหางน้ำตา (Tear-drop)',
          type: 'blood',
          description: 'หยดเลือดมีหางชี้ไปทางผนัง บ่งบอกมุมกระทบประมาณ 42 องศา เกิดจากการเหวี่ยงอาวุธ (Cast-off Spatter)',
          locationLabel: 'หยดเลือดหลักบนพื้น',
          pinX: 45,
          pinY: 40,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'หยดบริวารขนาดเล็ก (Satellite Splatters)',
          type: 'blood',
          description: 'ละอองเลือดขนาดเล็กกว่า 1 มม. แตกกระจายโดยรอบ เกิดจากการกระทบด้วยความเร็วปานกลาง (Medium Velocity)',
          locationLabel: 'รัศมีละอองเลือดรอบข้าง',
          pinX: 65,
          pinY: 65,
        }
      );
      break;

    case 'spark_wire':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'เม็ดทองแดงหลอมละลาย (Copper Globules)',
          type: 'burn',
          description: 'ปลายสายทองแดงเปลือยหลอมรวมเป็นก้อนกลมมน แสดงถึงความร้อนสูงกว่า 1,085°C จาก Electric Arc',
          locationLabel: 'ปลายลวดทองแดงเปลือย',
          pinX: 54,
          pinY: 32,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'รอยไหม้เกรียมของฉนวนยาง',
          type: 'burn',
          description: 'ฉนวนยาง PVC มีรอยไหม้ดำเป็นคาร์บอนและแตกร้าวจากการรับภาระกระแสเกินพิกัด',
          locationLabel: 'ปลอกฉนวนสายไฟ',
          pinX: 40,
          pinY: 68,
        }
      );
      break;

    case 'joule_burn':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'หลุมไหม้เกรียมศูนย์กลาง (Crater Defect)',
          type: 'burn',
          description: 'จุดสัมผัสไฟฟ้ามีรอยไหม้เกรียมยุบเป็นหลุมลึกถึงชั้นใต้ผิวหนัง ขอบแข็งกระด้าง',
          locationLabel: 'ศูนย์กลางรอยไหม้ที่ฝ่ามือ',
          pinX: 50,
          pinY: 48,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'วงแหวนผิวซีดพองนูน (Pallor Halo)',
          type: 'burn',
          description: 'บริเวณรอบรอยไหม้มีเนื้อเยื่อซีดขาวพองนูนอันเป็นเอกลักษณ์ทางนิติเวชของ Joule Burn',
          locationLabel: 'ขอบวงรอบนอก',
          pinX: 62,
          pinY: 35,
        }
      );
      break;

    case 'froth':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'ฟองละเอียดคงตัวสูง (Persistent Foam Column)',
          type: 'droplet',
          description: 'ฟองอากาศสีขาวเนื้อละเอียดแทรกด้วยเสมหะ ไม่สลายตัวง่าย เกิดจากน้ำทำปฏิกิริยากับ Surfactant ในถุงลม',
          locationLabel: 'กลุ่มฟองรอบรูจมูกและริมฝีปาก',
          pinX: 48,
          pinY: 46,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'คราบเมือกและอนุภาคตะกอนน้ำ',
          type: 'droplet',
          description: 'ตรวจพบจุลชีพตะไคร่น้ำและเศษละอองทรายปนเปื้อนในฟองเมือก ยืนยันการสำลักน้ำจากสระจริง',
          locationLabel: 'มุมปากด้านล่าง',
          pinX: 60,
          pinY: 62,
        }
      );
      break;

    case 'brazier':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'เถ้าถ่านคาร์บอนสีขาวอมเทา',
          type: 'burn',
          description: 'ก้อนถ่านเผาไหม้ในสภาวะออกซิเจนจำกัด เกิดก๊าซคาร์บอนมอนอกไซด์ (CO) ปริมาณมหาศาล',
          locationLabel: 'ใจกลางเตาอั้งโล่',
          pinX: 52,
          pinY: 44,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'คราบเขม่าควันไฟบนกระทะรอง',
          type: 'burn',
          description: 'เขม่าดำละเอียดจับตัวหนาแน่นรอบขอบเตา บ่งบอกการจุดไฟทิ้งไว้ต่อเนื่องมากกว่า 4 ชั่วโมง',
          locationLabel: 'ขอบเตาและถาดรอง',
          pinX: 35,
          pinY: 65,
        }
      );
      break;

    case 'cherry_skin':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'ผิวหนังและสภาพศพสีแดงสดเชอร์รี่ (Cherry-red Livor)',
          type: 'cyanosis',
          description: 'รอยตกของเลือดเปลี่ยนเป็นสีแดงชมพูสด (Cherry-red) จากสารประกอบคาร์บอกซีฮีโมโกลบิน (HbCO) สูงกว่า 65%',
          locationLabel: 'ผิวหนังบริเวณแก้มและลำคอ',
          pinX: 50,
          pinY: 45,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'ความยืดหยุ่นของผิวหนังไม่มีรอยช้ำ',
          type: 'scratch',
          description: 'ไม่มีบาดแผลถูกกระแทก เลือดใต้ผิวหนังคงความสดแดงแม้ผ่านไปหลายชั่วโมง',
          locationLabel: 'ใต้ขากรรไกร',
          pinX: 64,
          pinY: 58,
        }
      );
      break;

    case 'tape':
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: 'แนวเทปกาวปิดผนึกรอยต่อแน่นหนา',
          type: 'scratch',
          description: 'เทปกาวสีน้ำตาลรีดทับรอยต่อวงกบประตูหน้าต่างทุกบานอย่างตั้งใจเพื่อป้องกันอากาศหมุนเวียน',
          locationLabel: 'รอยต่อเทปกาวกับวงกบ',
          pinX: 46,
          pinY: 38,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'คราบกาวเหนียวและลายนิ้วมือแฝง',
          type: 'fingerprint',
          description: 'พบรอยนิ้วมือแฝงด้านเหนียวของเทป รีดทับจากด้านในห้องเท่านั้น',
          locationLabel: 'แถบกาวด้านในห้อง',
          pinX: 58,
          pinY: 62,
        }
      );
      break;

    default:
      // Generic high-grade forensic traces
      traces.push(
        {
          id: `${clue.id}-tr1`,
          name: clue.suspiciousVisualCue || 'ร่องรอยต้องสงสัยทางนิติเวช',
          type: 'scratch',
          description: clue.closeUpAnalysis || clue.desc,
          locationLabel: 'จุดศูนย์กลางวัตถุพยาน',
          pinX: 50,
          pinY: 40,
        },
        {
          id: `${clue.id}-tr2`,
          name: 'คราบสารและรอยนิ้วมือแฝงระดับจุลภาค',
          type: 'fingerprint',
          description: 'ตรวจพบคราบไขมันเซลล์ชีวภาพและอนุภาคสิ่งแปลกปลอมเกาะติดพื้นผิว',
          locationLabel: 'บริเวณขอบวัตถุ',
          pinX: 62,
          pinY: 65,
        }
      );
      break;
  }

  return traces;
};
